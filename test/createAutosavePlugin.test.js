import {
  convertFromRaw,
  Modifier,
  EditorState
} from 'draft-js';
import test from 'ava';
import { stub, useFakeTimers } from 'sinon';
import createAutosavePlugin from '../src';
import content from './fixtures/content';

let editorState;
let saveStub;
let defaultConfig;
const now = new Date();
let clock;

test.beforeEach(() => {
  clock = useFakeTimers(now);
  saveStub = stub();
  defaultConfig = { saveFunction: saveStub };
  const contentState = convertFromRaw(content);
  editorState = EditorState.createWithContent(contentState);
});

test.afterEach.always(() => {
  clock.restore();
  saveStub.reset();
});

test('it should create a draft-js plugin with the right exports', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  t.truthy(autosavePlugin);
  t.true(autosavePlugin.isClean());
});

test('onChange does nothing if no editorState supplied', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  t.true(autosavePlugin.isClean());
  autosavePlugin.onChange();
  t.true(autosavePlugin.isClean());
});

test('onChange doesn`t do anything on first onChange (initial render)', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  autosavePlugin.onChange(editorState);
  t.true(autosavePlugin.isClean());
});

test.serial('onChange doesn`t do anything on editorState selection changes', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  // sim initial render
  autosavePlugin.onChange(editorState);
  const updated = EditorState.moveFocusToEnd(editorState);
  autosavePlugin.onChange(updated);
  t.true(autosavePlugin.isClean());
  clock.tick(3000);
  t.is(saveStub.callCount, 0);
});

test.serial('onChange sets clean to false and calls save function when content has changed', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  // sim initial render
  autosavePlugin.onChange(editorState);
  const newContent = Modifier.insertText(
    editorState.getCurrentContent(), editorState.getSelection(), 'new text',
  );
  const updated = EditorState.push(editorState, newContent, 'insert-characters');
  autosavePlugin.onChange(updated);
  t.false(autosavePlugin.isClean());
  clock.tick(3000);
  t.is(saveStub.callCount, 1);
  t.true(autosavePlugin.isClean());
});

test.serial('onChange clean in progress save when content has changed', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  // sim initial render
  autosavePlugin.onChange(editorState);

  let newContent = Modifier.insertText(
    editorState.getCurrentContent(), editorState.getSelection(), 'new text',
  );
  let updated = EditorState.push(editorState, newContent, 'insert-characters');
  autosavePlugin.onChange(updated);
  t.false(autosavePlugin.isClean());

  clock.tick(500);

  // twice
  newContent = Modifier.insertText(
    editorState.getCurrentContent(), editorState.getSelection(), 'more new text',
  );
  updated = EditorState.push(editorState, newContent, 'insert-characters');
  autosavePlugin.onChange(updated);
  t.false(autosavePlugin.isClean());

  clock.tick(3000);
  t.is(saveStub.callCount, 1);
  t.true(autosavePlugin.isClean());
});

test.serial('onChange clean to false and ignores save function (if no one) when content has changed', (t) => {
  const autosavePlugin = createAutosavePlugin({});
  // sim initial render
  autosavePlugin.onChange(editorState);
  const newContent = Modifier.insertText(
    editorState.getCurrentContent(), editorState.getSelection(), 'new text',
  );
  const updated = EditorState.push(editorState, newContent, 'insert-characters');
  autosavePlugin.onChange(updated);
  t.false(autosavePlugin.isClean());
  clock.tick(3000);
  t.is(saveStub.callCount, 0);
  t.true(autosavePlugin.isClean());
});
