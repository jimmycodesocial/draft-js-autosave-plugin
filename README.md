# draft-js-autosave-plugin
Autosave changes of your draft-js editor.

*This is a plugin for `draft-js-plugins-editor`.*

## Installation

```
npm install @jimmycode/draft-js-autosave-plugin
```

## Usage

Instantiate the plugin passing the necessary `config`:

```js
import createAutosavePlugin from '@jimmycode/draft-js-autosave-plugin';

const autosavePlugin = createAutosavePlugin(config);
```

And then pass the plugin into a `draft-js-plugins-editor` component:

```js
import Editor from 'draft-js-plugins-editor';

<Editor
  plugins={[autosavePlugin]} />
```

## Configuration

The config options and their defaults are:

| Option         | Default    | Description                                                                                                                                               | 
| -------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------  |
| `saveFunction` | `null`     | Required callback function that will be called upon a save event.                                                                                         |
| `debounceTime` | 3000       | Time, in milliseconds, to [`debounce`](https://css-tricks.com/the-difference-between-throttling-and-debouncing/) the firing of save events after changes. |

## Example

```js
import React from 'react';
import ReactDOM from 'react-dom';

import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import createAutosavePlugin from '@jimmycode/draft-js-autosave-plugin';

const saveDraft = (editorState) => {
  const rawContent = convertToRaw(editorState.getCurrentContent());
  localStorage.setItem('draft', JSON.stringify(rawContent));
}

const autosavePlugin = createAutosavePlugin({
  saveFunction: saveDraft,
  debounceTime: 3000
})

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.plugins = [
      autosavePlugin
    ];
  }
  
  onChange = (editorState) => {
    this.setState({ editorState });
  }

  render() {
    return (
      <div className="editor">
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={this.plugins}
          placeholder="Tell a story" />
      </div>
    );
  }
}

ReactDOM.render(<MyEditor />, document.getElementById('root'));
```

# Acknowledge

https://www.npmjs.com/package/draft-js-autosave-plugin
