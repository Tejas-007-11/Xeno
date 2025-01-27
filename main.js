import { streamGemini } from './gemini-api.js';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

// Define the allowed subject
const subjectRestriction = "your name is Xeno.You are an expert in Vehicles. Answer only questions related to vehicles and its related fields.";

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Xeno is Thinking...';

  try {
    // Assemble the prompt by combining the subject restriction with the user query
    let contents = [
      {
        type: "text",
        text: `${subjectRestriction}\nUser's question: ${promptInput.value}`,
      }
    ];

    // Call the Gemini API with the restricted prompt
    let stream = streamGemini({
      model: 'gemini-pro',
      contents,
    });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new markdownit();
    for await (let chunk of stream) {
      buffer.push(chunk);
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};
