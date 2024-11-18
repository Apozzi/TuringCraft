import { Vertex } from "../interfaces/Vertex";

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export default function generateTuringMachineCode(graphObject: {
    vertices: Vertex[];
    edgeWeights: any;
    currentState: number | null;
  }): string {
    if (!graphObject || !graphObject.vertices || graphObject.vertices.length === 0) {
        return `
// Empty Turing Machine
// No vertices defined

name: Empty Machine
init: q0
accept: qAccept

q0,-
qAccept,_,-
    `.trim();
    }
    const finalVertices = graphObject.vertices.filter(v => v.isFinal);
    const initialState = graphObject.vertices.find(v => v.label.startsWith('q0')) 
      ? 'q0' 
      : `q${graphObject.vertices[0].id}`;
    
    const acceptStates = finalVertices.length > 0 
      ? finalVertices.map(v => `q${v.id}`)
      : ['qAccept'];
  
    const machineName = 'Turing Craft - ' + generateUUID();
    const transitions: string[] = [];
  
    Object.entries(graphObject.edgeWeights).forEach(([sourceId, targets]: any) => {
      Object.entries(targets).forEach(([targetId, transitionRules] : any) => {
        transitionRules.forEach((rule: any) => {
          const sourceState = `q${sourceId}`;
          const targetState = `q${targetId}`;
          
          transitions.push(`${sourceState},${rule.read}
${targetState},${rule.write},${rule.move === "R" ? ">" : "<"}
`
          );
        });
      });
    });
  
    return `
// Turing Machine: ${machineName}
// Automatically generated from graph object

name: ${machineName}
init: ${initialState}
accept: ${acceptStates.join(",")}
  
${transitions.join('\n')}
`.trim();
}
  