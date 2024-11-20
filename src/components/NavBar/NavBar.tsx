import React from 'react';
import './NavBar.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import AboutViewModal from '../AboutViewModal/AboutViewModal';
import CustomVerticeSongViewModal from '../CustomVerticeSongViewModal/CustomVerticeSongViewModal';
import ConfigurationViewModal from '../ConfigurationViewModal/ConfigurationViewModal';
import TreeLayoutConfigViewModal from '../TreeLayoutConfigViewModal/TreeLayoutConfigViewModal';
import RadialLayoutConfigViewModal from '../RadialLayoutConfigViewModal/RadialLayoutConfigViewModal';
import { FormattedMessage } from 'react-intl';
import CodeGenerationModal from '../CodeGenerationModal/CodeGenerationModal';
import TuringMachineTape from '../TuringMachineTape/TuringMachineTape';


export default class NavBar extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      config: {
        useEmptyTapeValue: false
      }
    };
  }

  componentDidMount() {
    GraphSchematicsManager.onChangeConfig().subscribe((config: any) => this.setState({config}));
  }

  private zerosToEmpty = (tape: string[]) => tape.map(e => e === "0" ? "" : e);

  saveGraph = () => {
    const state = GraphSchematicsManager.getGraphState();
    const jsonString = JSON.stringify(state);

    // TODO: Fazer funcionar para save para aplicação desktop.
    this.browserDownload(jsonString);
  };

  private desktopDownload = (jsonString: string) => {
    /* 
    dialog.showSaveDialog({
    title: 'Select the File Path to save',
    buttonLabel: 'Save',
    // Restringindo o usuário apenas a arquivos de texto
    filters: [
      {
        name: 'Text Files',
        extensions: ['txt', 'docx']
      }
    ],
    properties: []
  })
    .then((file: any) => {
      // Verifica se a operação foi cancelada
      console.log(file.canceled);
      if (!file.canceled && file.filePath) {
        console.log(file.filePath.toString());

        // Criando e escrevendo no arquivo sample.txt
        fs.writeFile(file.filePath.toString(), 'This is a Sample File', (err) => {
          if (err) throw err;
          console.log('Saved!');
        });
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
    */
  };
  
  private browserDownload = (jsonString: string) => {
    const fileName = prompt('Digite o nome do arquivo para salvar:', 'graph_state.json');
    if (!fileName) return;
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  openGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const state = JSON.parse(content);
          state.currentState = null;
          state.headPosition = null;
          state.isRunning = false;
          state.vertexHistory = [];
          state.actualVertex = null;
          GraphSchematicsManager.loadGraphState(state);
          GraphSchematicsManager.changeHeadPositionAndTape(state.headPosition, state.tape);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file. Please select a valid graph state file.');
        }
      };
      reader.readAsText(file);
    }
  };

  private getEmptyTape() {
    const { config } = this.state;
    const tape = Array(1000).fill("0");
    return config.useEmptyTapeValue ? this.zerosToEmpty(tape) : tape
  }

  private loadExample(tape: string[], savedObject: any) {
    GraphSchematicsManager.setPlayOrStop(false);
    setTimeout(() => {
      GraphSchematicsManager.loadGraphState(savedObject);
      GraphSchematicsManager.changeHeadPositionAndTape(null, tape);
      TuringMachineTape.tapeChange(tape);
    }, 50);
  }

  openExampleCiclicLoop = () => {
    const tape = this.getEmptyTape();
    tape[498] = "0"; tape[499] = "0"
    this.loadExample(tape, {"offsetX":246,"offsetY":20,"width":1724,"height":1000,"scale":1,"vertices":[{"id":3,"x":773,"y":175,"label":"C","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":4,"x":777,"y":501,"label":"D","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":2,"x":416,"y":177,"label":"B","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":1,"x":414,"y":496,"label":"A","visitCount":19,"sound":{"type":"note","value":"A"},"isFinal":false}],"edges":[{"source":1,"target":2},{"source":2,"target":3},{"source":3,"target":4},{"source":4,"target":1}],"selectedVertex":null,"draggingVertex":false,"edgeCreationMode":false,"edgeStartVertex":null,"edgeWeights":{"1":{"2":[{"read":"0","write":"1","move":"R"}]},"2":{"3":[{"read":"0","write":"1","move":"L"}]},"3":{"4":[{"read":"1","write":"0","move":"R"}]},"4":{"1":[{"read":"1","write":"0","move":"L"}]}},"audioContext":{},"vertexHistory":[],"centroid":{"x":595,"y":337.25},"centroidUpdateCounter":76,"tape":tape});
  };

  openExampleBinaryCounter = () => {
    GraphSchematicsManager.loadGraphState({});
  };

  openExampleBinaryPalindrome = () => {
    const tape = this.getEmptyTape();
    tape[497] = "#"; tape[498] = "1"; tape[499] = "0"; tape[500] = "1"; tape[501] = "1"; tape[502] = "0"; tape[503] = "1"; tape[504] = "#";
    this.loadExample(tape, {"offsetX":79,"offsetY":23,"width":1541,"height":917,"scale":1,"vertices":[{"id":4,"x":782,"y":136,"label":"D","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":1,"x":345,"y":281,"label":"A","visitCount":4,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":3,"x":526,"y":447,"label":"C","visitCount":22,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":2,"x":518,"y":137,"label":"B","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":5,"x":781,"y":448,"label":"E","visitCount":7,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":6,"x":944,"y":291,"label":"F","visitCount":14,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":7,"x":336,"y":496,"label":"G","visitCount":1,"sound":{"type":"note","value":"A"},"isFinal":true}],"edges":[{"source":1,"target":2},{"source":1,"target":3},{"source":2,"target":2},{"source":3,"target":3},{"source":2,"target":4},{"source":3,"target":5},{"source":4,"target":6},{"source":5,"target":6},{"source":1,"target":7},{"source":4,"target":4},{"source":5,"target":5},{"source":6,"target":1},{"source":6,"target":6}],"selectedVertex":null,"draggingVertex":false,"edgeCreationMode":false,"edgeStartVertex":null,"edgeWeights":{"1":{"2":[{"read":"1","write":"B","move":"R"}],"3":[{"read":"0","write":"B","move":"R"}],"7":[{"read":"B","write":"B","move":"R"}]},"2":{"2":[{"read":"1","write":"1","move":"R"},{"read":"0","write":"0","move":"R"},{"read":"B","write":"B","move":"R"}],"4":[{"read":"#","write":"#","move":"L"}]},"3":{"3":[{"read":"1","write":"1","move":"R"},{"read":"0","write":"0","move":"R"},{"read":"B","write":"B","move":"R"}],"5":[{"read":"#","write":"#","move":"L"}]},"4":{"4":[{"read":"B","write":"B","move":"L"}],"6":[{"read":"1","write":"B","move":"L"}]},"5":{"5":[{"read":"B","write":"B","move":"L"}],"6":[{"read":"0","write":"B","move":"L"}]},"6":{"1":[{"read":"B","write":"B","move":"R"}],"6":[{"read":"1","write":"1","move":"L"},{"read":"0","write":"0","move":"L"}]}},"actualVertex":null,"audioContext":{},"vertexHistory":[],"backupInputTape":[],"centroid":{"x":617.6666666666666,"y":298.1666666666667},"centroidUpdateCounter":109,"tape":tape,"headPosition":498,"currentState":null,"isRunning":false});
  }

  openExampleDivisibleByThree = () => {
    const tape = this.getEmptyTape();
    tape[497] = "#"; tape[498] = "1"; tape[499] = "0"; tape[500] = "0"; tape[501] = "1"; tape[502] = "1"; tape[503] = "1"; tape[504] = "#";
    this.loadExample(tape, {"offsetX":9,"offsetY":-8,"width":1724,"height":1000,"scale":1,"vertices":[{"id":2,"x":735,"y":282,"label":"B","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":3,"x":1026,"y":290,"label":"C","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":1,"x":435,"y":288,"label":"A","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":4,"x":432,"y":507,"label":"D","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":true}],"edges":[{"source":1,"target":1},{"source":1,"target":2},{"source":2,"target":3},{"source":3,"target":3},{"source":3,"target":2},{"source":2,"target":1},{"source":1,"target":4}],"selectedVertex":null,"draggingVertex":false,"edgeCreationMode":false,"edgeStartVertex":null,"edgeWeights":{"1":{"1":[{"read":"0","write":"0","move":"R"}],"2":[{"read":"1","write":"1","move":"R"}],"4":[{"read":"#","write":"#","move":"R"}]},"2":{"1":[{"read":"1","write":"1","move":"R"}],"3":[{"read":"0","write":"0","move":"R"}]},"3":{"2":[{"read":"0","write":"0","move":"R"}],"3":[{"read":"1","write":"1","move":"R"}]}},"audioContext":{},"vertexHistory":[],"backupInputTape":tape,"isRunning":false,"config":{"speed":1.001,"offsetScreenDisplay":0}});
  }

  render() {
    return (
      <div className="navbar">
        <CustomVerticeSongViewModal></CustomVerticeSongViewModal>
        <ConfigurationViewModal></ConfigurationViewModal>
        <AboutViewModal></AboutViewModal>
        <TreeLayoutConfigViewModal></TreeLayoutConfigViewModal>
        <RadialLayoutConfigViewModal></RadialLayoutConfigViewModal>
        <CodeGenerationModal></CodeGenerationModal>
        <div className='title' data-text="Turing Craft">
          Turing Craft
        </div>
        <div className="navbar--button" onClick={() => GraphSchematicsManager.resetAll()}>
          <FormattedMessage id={"clear"}/>
        </div>
        <div className="navbar--button" onClick={() => document.getElementById('file-input')?.click()}>
          <input
            id="file-input"
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => {
              this.openGraph(e);
              e.target.value = '';
            }}
          />
          <label className="file-input-label">
            <FormattedMessage id={"open"}/>
          </label>
        </div>
        <div className="navbar--button" onClick={this.saveGraph}>
          <FormattedMessage id={"save"}/>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> <FormattedMessage id={"examples"}/>
          </div>
          <div className="subnav--content">
            <a onClick={() => this.openExampleCiclicLoop()}><FormattedMessage id={"infinite_loop_example"}/></a>
            <a onClick={() => this.openExampleBinaryCounter()}><FormattedMessage id={"binary_counter_example"}/></a>
            <a onClick={() => this.openExampleDivisibleByThree()}><FormattedMessage id={"binary_divisible_by_3"}/></a>
            <a onClick={() => this.openExampleBinaryPalindrome()}><FormattedMessage id={"palindrome_example"}/></a>
          </div>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> <FormattedMessage id={"graph_layout_and_organization"}/>
          </div>
          <div className="subnav--content">
            <a onClick={() => GraphSchematicsManager.applyCircularLayout()}><FormattedMessage id={"circular_layout"}/></a>
            <a onClick={() => RadialLayoutConfigViewModal.openModal({})}><FormattedMessage id={"radial_layout"}/></a>
            <a onClick={() => TreeLayoutConfigViewModal.openModal({})}><FormattedMessage id={"tree_layout"}/></a>
            <a onClick={()=> GraphSchematicsManager.applyGridLayout()}><FormattedMessage id={"grid_layout"}/></a>
            <a onClick={()=> GraphSchematicsManager.applySpectralLayout()}><FormattedMessage id={"spectral_layout"}/></a>
            <a onClick={() => GraphSchematicsManager.applyFruchtermanReingold()}><FormattedMessage id={"fruchterman_reingold"}/></a>
            <a onClick={()=> GraphSchematicsManager.applyKamadaKawai()}><FormattedMessage id={"kamada_kawai"}/></a>
          </div>
        </div>

        <div className="navbar--button" onClick={() => CodeGenerationModal.openModal({})}>
          <FormattedMessage id={"code_generation"}/>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> <FormattedMessage id={"config"}/>
          </div>
          <div className="subnav--content">
            <a onClick={() => CustomVerticeSongViewModal.openModal({})}><FormattedMessage id={"custom_sounds"}/></a>
            <a onClick={() => ConfigurationViewModal.openModal({})}><FormattedMessage id={"configurations"}/></a>
          </div>
        </div>

        <div className="navbar--button" onClick={() => AboutViewModal.openModal({})}>
          <FormattedMessage id={"about"}/>
        </div>
      </div>
    )
  }
}
