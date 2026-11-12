const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function readWorkflow(name) {
  const ast = require('prettier/plugins/yaml').parsers.yaml.parse(
    fs.readFileSync(path.join(__dirname, '../workflows', name), 'utf8'));
  function convert(node) {
    if (node.type === 'mapping') {
      const entries = node.children.map(item => item.children.map(convert));
      assert.equal(new Set(entries.map(([key]) => key)).size, entries.length, 'Duplicate YAML key');
      return Object.fromEntries(entries);
    }
    if (['sequence', 'flowSequence'].includes(node.type)) return node.children.map(convert);
    if (['root', 'document'].includes(node.type)) {
      return node.children.map(convert).find(value => value && !Array.isArray(value));
    }
    if (node.children?.length === 1) return convert(node.children[0]);
    return node.value;
  }
  return convert(ast);
}

const ci = readWorkflow('angular-ci.yml');
const auto = readWorkflow('auto-fix.yml');
const step = id => auto.jobs.inspect.steps.find(item => item.id === id);
const publisher = auto.jobs.publish.steps.find(item => item.with?.script);
const full = 'Carolin724/ki-software-engineer';
const head = 'a'.repeat(40);
const marker = '<!-- angular-auto-fix:pr-12 -->';
const bot = { login: 'github-actions[bot]', type: 'Bot' };

// Run the actual embedded workflow scripts; all filesystem/network/GitHub mutations
// are in-memory fakes. No workflow helper or application script is executed.
function harness(options = {}) {
  const state = { outputs: {}, effects: [], issues: [], files: new Map(),
    marker: options.existingMarker ? head : null, failed: [], notices: [], options };
  const run = { id: 100, workflow_id: 10, run_attempt: 1, repository: { full_name: full },
    head_repository: { full_name: full }, event: 'pull_request', conclusion: 'failure',
    actor: { login: 'Carolin724' }, triggering_actor: { login: 'Carolin724' },
    pull_requests: [{ number: options.number || 12 }], head_branch: 'feature/book',
    head_sha: head, html_url: 'https://github.com/' + full + '/actions/runs/100', ...options.run };
  const pr = { number: options.number || 12, state: 'open', draft: false,
    user: { login: 'Carolin724' }, head: { sha: head, ref: 'feature/book', repo: { full_name: full } },
    base: { ref: 'main', repo: { full_name: full } }, changed_files: 1 };
  const listJobs = () => {}, listAttemptJobs = () => {}, listFiles = () => {};
  const listIssues = () => {}, listPrs = () => {};
  const github = { rest: {
    actions: {
      getWorkflowRun: async () => ({ data: run }),
      getWorkflow: async () => ({ data: { path: '.github/workflows/angular-ci.yml', name: 'Angular CI' } }),
      listJobsForWorkflowRunAttempt: listAttemptJobs, listJobsForWorkflowRun: listJobs,
      downloadJobLogsForWorkflowRun: async input => {
        if (options.logApiFailure && input.job_id === 20) throw Object.assign(new Error('Log API unavailable'), { status: 503 });
        const logs = input.job_id === 20 ? options.logs || 'Error TS2322: incompatible type' : 'Error: inspection could not read logs';
        let data = logs;
        if (options.logBody === 'buffer') data = Buffer.from(logs);
        if (options.logBody === 'arraybuffer') {
          const bytes = Buffer.from(logs);
          data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        }
        // Octokit follows the REST endpoint's redirect and returns the final body.
        // There is no Location header on that HTTP 200 response.
        return { status: options.logHttpFailure ? 503 : 200, headers: {}, data };
      }
    },
    pulls: {
      get: async () => ({ data: pr }), listFiles, list: listPrs,
      create: async input => {
        state.effects.push(['createPR', input]);
        if (options.prFailure) throw Object.assign(new Error('PR forbidden'), { status: 403 });
        return { data: { html_url: 'https://github.com/' + full + '/pull/30' } };
      }
    },
    issues: {
      listForRepo: listIssues,
      create: async input => {
        state.effects.push(['createIssue', input]);
        if (options.issueFailure) throw Object.assign(new Error('Issue unavailable'), { status: 503 });
        const issue = { ...input, number: state.issues.length + 50, state: 'open', user: bot };
        state.issues.push(issue);
        return { data: issue };
      },
      update: async input => {
        state.effects.push(['updateIssue', input]);
        Object.assign(state.issues.find(item => item.number === input.issue_number), input);
        return { data: {} };
      }
    },
    git: {
      getRef: async () => {
        if (!state.marker) throw { status: 404 };
        return { data: { object: { sha: state.marker } } };
      },
      createRef: async input => {
        state.effects.push(['createRef', input]);
        state.marker = input.sha;
        if (options.interruptAfterRef) throw new Error('Runner interrupted immediately after createRef');
        return { data: {} };
      },
      getTree: async () => {
        if (options.treeFailure) throw new Error('Source tree analysis failed');
        return { data: { tree: [{ path: 'src/app/books/book.ts', type: 'blob', mode: '100644',
          size: 30, sha: 'b'.repeat(40) }] } };
      },
      getBlob: async () => ({ data: { content: Buffer.from('export const n = 0;').toString('base64') } }),
      getCommit: async () => ({ data: { tree: { sha: 'b'.repeat(40) } } }),
      createTree: async input => {
        state.effects.push(['createTree', input]); return { data: { sha: 'c'.repeat(40) } };
      },
      createCommit: async input => {
        state.effects.push(['createCommit', input]); return { data: { sha: 'd'.repeat(40) } };
      },
      updateRef: async input => {
        state.effects.push(['updateRef', input]); state.marker = input.sha; return { data: {} };
      }
    }
  }, paginate: async method => {
    if (method === listAttemptJobs) {
      if (options.jobListFailure) throw new Error('Build jobs unavailable');
      return [{ id: 20, name: 'Angular build', conclusion: 'failure',
        steps: [{ name: 'Build Angular', conclusion: options.installFailure ? 'skipped' : 'failure' }] }];
    }
    if (method === listJobs) {
      if (options.attemptListFailure) throw new Error('Diagnostic logs unavailable');
      return [{ id: 21, name: 'inspect', conclusion: 'failure' }];
    }
    if (method === listFiles) return [{ filename: 'src/app/books/book.ts' }];
    if (method === listIssues) return state.issues;
    if (method === listPrs) return options.repairPr ? [{ head: { repo: { full_name: full }, ref: 'auto-fix/pr-12' },
      user: bot, html_url: 'https://github.com/' + full + '/pull/30', body: marker }] : [];
    throw new Error('Unexpected pagination');
  } };
  const context = { repo: { owner: 'Carolin724', repo: 'ki-software-engineer' }, runId: 200,
    payload: { repository: { full_name: full }, workflow_run: run } };
  async function execute(script, env = {}) {
    return vm.runInNewContext('(async () => {\n' + script + '\n})()', {
      context, github, Buffer, URL, process: { env: { RUNNER_TEMP: '/temporary', ...env } },
      core: { setOutput: (key, value) => { state.outputs[key] = value; },
        notice: value => state.notices.push(value), warning: value => state.notices.push(value),
        setFailed: value => state.failed.push(value) },
      fetch: async () => { throw new Error('Unexpected secondary log fetch'); },
      require: name => name === 'node:fs' ? {
        mkdirSync() {},
        writeFileSync: (file, content) => state.files.set(file.replaceAll('\\', '/'), content),
        readFileSync: file => {
          const normalized = file.replaceAll('\\', '/');
          if (normalized.endsWith('proposal.json') && state.proposal) return JSON.stringify(state.proposal);
          if (!state.files.has(normalized)) throw new Error('Artifact unavailable');
          return state.files.get(normalized);
        }
      } : require(name)
    });
  }
  state.authorize = () => execute(step('authorize').with.script);
  state.inspect = () => execute(step('inspect').with.script, {
    ORIGINAL_PR: state.outputs.pr, ORIGINAL_HEAD: state.outputs.head
  });
  state.publish = (result = 'failure', verified = 'skipped') => execute(publisher.with.script, {
    ORIGINAL_PR: state.outputs.pr, ORIGINAL_HEAD: state.outputs.head,
    REPAIR_BRANCH: state.outputs.branch, TARGET_BRANCH: state.outputs.target,
    INSPECT_RESULT: result, DUPLICATE: state.outputs.duplicate || '', VERIFIED: verified,
    PROPOSED: verified === 'success' ? 'success' : 'skipped'
  });
  state.shouldPublish = result => new Function('always', 'needs', 'return ' + auto.jobs.publish.if)(() => true, {
    inspect: { result, outputs: state.outputs }
  });
  return state;
}

test('PR 9 and 11 skip every build step; other own-repository PRs remain eligible', () => {
  const eligible = (number, repository = full) => new Function('github', 'return ' + ci.jobs.build.if)({
    repository, event: { pull_request: { number } }
  });
  assert.equal(eligible(9), false);
  assert.equal(eligible(11), false);
  assert.equal(eligible(12), true);
  assert.equal(eligible(12, 'someone/fork'), false);
});

test('workflow names, build verification and minimal CI permissions remain connected', () => {
  assert.deepEqual(auto.on.workflow_run.workflows, [ci.name]);
  assert.equal(ci.permissions.contents, 'read');
  assert.deepEqual(Object.keys(ci.permissions), ['contents']);
  assert(ci.jobs.build.steps.some(item => item.run === 'npm run build'));
  assert(auto.jobs.verify.steps.some(item => item.run === 'npm run build'));
  assert(auto.jobs.propose.steps.some(item => item.uses?.startsWith('openai/codex-action@')));
  assert.equal(auto.jobs.verify.permissions.contents, 'read');
  assert.equal(auto.jobs.verify.permissions.issues, undefined);
  assert.equal(auto.jobs.verify.permissions['pull-requests'], undefined);
});

test('Codex action defaults and workflow arguments produce only one git-check override', () => {
  const codex = auto.jobs.propose.steps.find(item => item.uses?.startsWith('openai/codex-action@'));
  // The pinned action supplies this flag itself (also present in the failing CI log).
  const actionArguments = ['exec', '--skip-git-repo-check'];
  const extraArguments = JSON.parse(codex.with['codex-args'] || '[]');
  const argv = [...actionArguments, ...extraArguments];
  assert.equal(argv.filter(argument => argument === '--skip-git-repo-check').length, 1,
    'codex exec rejects repeated --skip-git-repo-check arguments');
});

for (const logBody of ['text', 'buffer', 'arraybuffer']) {
  test('HTTP 200 ' + logBody + ' logs without Location reach the Codex analysis input', async () => {
    const logs = 'Error TS2322: falscher Typ für Bücher';
    const state = harness({ logBody, logs });
    await state.authorize();
    await state.inspect();
    assert.equal(state.outputs.repairable, 'true');
    const input = JSON.parse([...state.files.values()][0]);
    assert.equal(input.logs, logs);
    assert.equal(input.files[0].path, 'src/app/books/book.ts');
    assert.equal(state.issues.length, 1);
  });
}

test('diagnostic publication also consumes the final log body without a redirect header', async () => {
  const state = harness({ jobListFailure: true });
  await state.authorize();
  await assert.rejects(state.inspect());
  await state.publish();
  assert.match(state.issues[0].body, /inspection could not read logs/);
});

for (const options of [{ number: 9 }, { number: 11 }, { run: { head_repository: { full_name: 'someone/fork' } } }]) {
  test('untrusted or protected run never authorizes diagnostics: ' + JSON.stringify(options), async () => {
    const state = harness(options);
    await state.authorize();
    assert.equal(state.outputs.authorized, undefined);
    assert.equal(state.shouldPublish('success'), false);
    assert.deepEqual(state.effects, []);
  });
}

for (const flag of ['jobListFailure', 'logApiFailure', 'logHttpFailure', 'treeFailure', 'interruptAfterRef']) {
  test(flag + ': authorization survives inspection failure and produces a diagnosis', async () => {
    const state = harness({ [flag]: true });
    await state.authorize();
    await assert.rejects(state.inspect());
    assert.equal(state.outputs.authorized, 'true');
    assert.equal(state.shouldPublish('failure'), true);
    await state.publish();
    assert.equal(state.issues.length, 1);
    assert.match(state.issues[0].title, /manual repair/);
    assert.match(state.issues[0].body, /Inspection failed or was interrupted/);
    assert.match(state.issues[0].body, /actions\/runs\/100/);
    assert.match(state.issues[0].body, /actions\/runs\/200/);
    assert(!state.effects.some(([action]) => ['createCommit', 'updateRef', 'createPR'].includes(action)));
  });
}

test('missing diagnostic job logs cannot prevent the fallback issue', async () => {
  const state = harness({ jobListFailure: true, attemptListFailure: true });
  await state.authorize();
  await assert.rejects(state.inspect());
  await state.publish();
  assert.equal(state.issues.length, 1);
  assert.match(state.issues[0].body, /actions\/runs\/200/);
});

test('no marker is created when the preceding durable issue cannot be saved', async () => {
  const state = harness({ issueFailure: true });
  await state.authorize();
  await assert.rejects(state.inspect(), /Issue unavailable/);
  assert.equal(state.marker, null);
  assert(!state.effects.some(([action]) => action === 'createRef'));
});

test('hard cancellation after marker creation already has an open diagnostic without publication', async () => {
  const state = harness({ interruptAfterRef: true });
  await state.authorize();
  await assert.rejects(state.inspect(), /Runner interrupted/);
  assert.equal(state.outputs.claimed, undefined);
  assert.equal(state.marker, head);
  assert.equal(state.issues.length, 1);
  assert.equal(state.issues[0].state, 'open');
  assert.match(state.issues[0].body, /interrupted/);
  assert.deepEqual(state.effects.map(([action]) => action), ['createIssue', 'createRef']);
});

test('legacy orphan marker gets a diagnosis without another repair attempt', async () => {
  const state = harness({ existingMarker: true });
  await state.authorize();
  await state.inspect();
  assert.equal(state.outputs.duplicate, 'true');
  assert.equal(state.outputs.repairable, undefined);
  assert.equal(state.shouldPublish('success'), true);
  await state.publish('success');
  assert.equal(state.issues.length, 1);
  assert.match(state.issues[0].body, /earlier attempt/i);
  assert(!state.effects.some(([action]) => action === 'createRef'));
});

test('existing in-progress record is reconciled without duplicate issues, even without a branch', async () => {
  const state = harness();
  state.issues.push({ number: 50, state: 'open', user: bot, body: marker + '\nInterrupted pending attempt' });
  await state.authorize();
  await state.inspect();
  await state.publish('success');
  assert.equal(state.issues.length, 1);
  assert.match(state.issues[0].title, /manual repair/);
  assert(!state.effects.some(([action]) => action === 'createRef'));
});

test('successful earlier repair is not re-diagnosed or retried', async () => {
  const state = harness({ existingMarker: true, repairPr: true });
  await state.authorize();
  await state.inspect();
  await state.publish('success');
  assert.deepEqual(state.effects, []);
});

test('manually closed diagnostic remains closed on a duplicate run', async () => {
  const state = harness({ existingMarker: true });
  state.issues.push({ number: 50, state: 'closed', user: bot, body: marker + '\nManual disposition' });
  await state.authorize();
  await state.inspect();
  await state.publish('success');
  assert.equal(state.issues[0].state, 'closed');
  assert.deepEqual(state.effects, []);
});

test('interruption after PR creation is reconciled by closing its still-pending attempt issue', async () => {
  const state = harness({ existingMarker: true, repairPr: true });
  state.issues.push({ number: 50, state: 'open', user: bot, body: marker + '\nPending attempt' });
  await state.authorize();
  await state.inspect();
  await state.publish('success');
  assert.equal(state.issues[0].state, 'closed');
  assert.match(state.issues[0].body, /pull\/30/);
  assert.deepEqual(state.effects.map(([action]) => action), ['updateIssue']);
});

test('installation failure is skipped without a marker or spurious repair issue', async () => {
  const state = harness({ installFailure: true });
  await state.authorize();
  await state.inspect();
  assert.equal(state.shouldPublish('success'), false);
  assert.deepEqual(state.effects, []);
});

test('verified repair still creates only its repair branch PR and closes its attempt issue', async () => {
  const state = harness();
  await state.authorize();
  await state.inspect();
  assert.equal(state.outputs.repairable, 'true');
  state.proposal = { decision: 'repair', summary: 'Fix TS2322', changes: [
    { path: 'src/app/books/book.ts', content: 'export const n = 1;' }
  ] };
  await state.publish('success', 'success');
  const update = state.effects.find(([action]) => action === 'updateRef')[1];
  assert.equal(update.ref, 'heads/auto-fix/pr-12');
  assert.equal(update.force, false);
  const repair = state.effects.find(([action]) => action === 'createPR')[1];
  assert.equal(repair.base, 'feature/book');
  assert.equal(repair.head, 'auto-fix/pr-12');
  assert.equal(state.issues.length, 1);
  assert.equal(state.issues[0].state, 'closed');
  assert.match(state.issues[0].body, /pull\/30/);
  assert.deepEqual(state.failed, []);
});

test('failed verification updates the pending issue instead of opening another issue', async () => {
  const state = harness();
  await state.authorize();
  await state.inspect();
  await state.publish('success', 'failure');
  assert.equal(state.issues.length, 1);
  assert.equal(state.issues[0].state, 'open');
  assert.match(state.issues[0].body, /independent npm run build failed/);
  assert(!state.effects.some(([action]) => action === 'createPR'));
});

test('PR publication failure keeps one actionable diagnostic and the repair branch', async () => {
  const state = harness({ prFailure: true });
  await state.authorize();
  await state.inspect();
  state.proposal = { decision: 'repair', summary: 'Fix TS2322', changes: [
    { path: 'src/app/books/book.ts', content: 'export const n = 1;' }
  ] };
  await state.publish('success', 'success');
  assert.equal(state.issues.length, 1);
  assert.equal(state.issues[0].state, 'open');
  assert.match(state.issues[0].body, /HTTP 403/);
  assert.equal(state.marker, 'd'.repeat(40));
});
