// @ts-ignore
import * as Blockly from "blockly";
import * as libraryBlocks from "blockly/blocks";
import * as En from "blockly/msg/en";
import { javascriptGenerator, Order } from "blockly/javascript";
import Interpreter from "js-interpreter";

const nameDialog = document.getElementById("naming-dialog");
const nameTextArea = document.getElementById("naming-textarea");
const prompt = document.getElementById("prompt");
const okBtn = document.getElementById("ok-button");
const cancelBtn = document.getElementById("cancel-button");

const customTheme = Blockly.Theme.defineTheme("customTheme", {
  base: Blockly.Themes.Classic,
  blockStyles: {
    logic_blocks: {
      colourPrimary: "#ff3300",
      colourSecondary: "#6b1200",
      colourTertiary: "#270b0b",
    },
    text_blocks: {
      colourPrimary: "#dc9be2",
      colourSecondary: "#690048",
      colourTertiary: "#270b21",
    },
    variable_blocks: {
      colourPrimary: "#1900bc",
      colourSecondary: "#070069",
      colourTertiary: "#0b1327",
    },
  },

  categoryStyles: {
    logic_category: {
      colour: "#4a148c",
    },
  },
  componentStyles: {
    workspaceBackgroundColour: "#241f1d",
    toolboxBackgroundColour: "#383838",
    toolboxForegroundColour: "#ffffff",
    flyoutBackgroundColour: "#6a6a6a",
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
    {
      kind: "block",
      type: "text_prompt_ext",
      inputs: {
        TEXT: {
          shadow: {
            type: "text",
            fields: {
              TEXT: "Enter a value:",
            },
          },
        },
      },
    },
  ],
};

nameDialog.showModal();

function initApi(interpreter, globalObject) {
  const alertWrapper = function (text) {
    prompt.textContent = "Enter a value: ";
    nameDialog.showModal();
  };
  const promptWrapper = function (text) {
    prompt.textContent = "Enter a value: ";
    nameDialog.showModal();
  };

  const printWrapper = function (text) {
    output.textContent += (text !== undefined ? text : "") + "\n";
  };

  output.textContent = "";
  interpreter.setProperty(globalObject, "prompt", interpreter.createNativeFunction(promptWrapper));

  interpreter.setProperty(globalObject, "alert", interpreter.createNativeFunction(alertWrapper));

  interpreter.setProperty(globalObject, "print", interpreter.createNativeFunction(printWrapper));
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

okBtn.addEventListener("click", () => {
  nameDialog.close();
});

cancelBtn.addEventListener("click", () => {
  nameDialog.close();
});
