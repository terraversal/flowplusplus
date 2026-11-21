// @ts-ignore
import * as Blockly from "blockly";
import "blockly/blocks";
import * as En from "blockly/msg/en";
import { javascriptGenerator, Order } from "blockly/javascript";
import Interpreter from "js-interpreter";

const customTheme = Blockly.Theme.defineTheme("customTheme", {
  base: Blockly.Themes.Classic,
  // 1. Style groups of blocks
  blockStyles: {
    logic_blocks: {
      colourPrimary: "#ff3300", // Main block color
      colourSecondary: "#6b1200", // Shadow block color
      colourTertiary: "#270b0b", // Border / highlight color
    },
  },
  // 2. Style toolbox categories
  categoryStyles: {
    logic_category: {
      colour: "#4a148c",
    },
  },
  // 3. Style workspace & UI components
  componentStyles: {
    workspaceBackgroundColour: "#241f1d",
    toolboxBackgroundColour: "#252526",
    toolboxForegroundColour: "#ffffff",
    flyoutBackgroundColour: "#333333",
    flyoutForegroundColour: "#cccccc",
    flyoutOpacity: 0.9,
    scrollbarColour: "#797979",
    insertionMarkerColour: "#ffffff",
    insertionMarkerOpacity: 0.3,
  },
});

const runBtn = document.getElementById("runBtn");
const stopBtn = document.getElementById("stopBtn");
const blocklyDiv = document.getElementById("blocklyDiv");
const output = document.getElementById("output");

javascriptGenerator.forBlock["text_print"] = function (block, generator) {
  const msg = generator.valueToCode(block, "TEXT", Order.NONE) || "''";
  return `print(${msg});\n`;
};

Blockly.setLocale(En);

Blockly.setLocale({
  TEXT_PRINT_TITLE: "println!(%1)",
});

const toolbox = {
  kind: "flyoutToolbox",
  contents: [
    { kind: "block", type: "controls_if" },
    { kind: "block", type: "logic_compare" },
    { kind: "block", type: "math_number" },
    {
      kind: "block",
      type: "text_print",
      inputs: {
        TEXT: {
          shadow: {
            type: "text",
            fields: {
              TEXT: "Flow++ is awesome",
            },
          },
        },
      },
    },
    {
      kind: "button",
      text: "Create variable...",
      callbackKey: "CREATE_VARIABLE",
    },
    {
      kind: "block",
      type: "variables_set",
      fields: {
        VAR: { name: "score" },
      },
    },
    {
      kind: "block",
      type: "math_change",
      fields: {
        VAR: { name: "score" },
      },
      inputs: {
        DELTA: {
          shadow: {
            type: "math_number",
            fields: { NUM: 1 },
          },
        },
      },
    },
    {
      kind: "block",
      type: "variables_get",
      fields: {
        VAR: { name: "score" },
      },
    },
  ],
};

function initApi(interpreter, globalObject) {
  output.textContent = "";

  const wrapper = function (text) {
    output.textContent += (text !== undefined ? text : "") + "\n";
  };

  interpreter.setProperty(globalObject, "print", interpreter.createNativeFunction(wrapper));
}

const workspace = Blockly.inject("blocklyDiv", {
  toolbox: toolbox,
  scrollbars: true,
  trashcan: true,
  sounds: false,
  theme: customTheme,
});

runBtn.addEventListener("click", () => {
  const code = javascriptGenerator.workspaceToCode(workspace);
  const myInterpreter = new Interpreter(code, initApi);

  let steps = 0;
  while (myInterpreter.step()) {
    if (++steps > 10000) {
      alert("An infinite loop was detected so the project was stopped.");
      break;
    }
  }
});
