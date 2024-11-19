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


export default class NavBar extends React.Component<any> {
  saveGraph = () => {
    const fileName = prompt('Digite o nome do arquivo para salvar:', 'graph_state.json');
    if (!fileName) return;
    let state = GraphSchematicsManager.getGraphState()
    const jsonString = JSON.stringify(state);
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

  openExampleCiclicLoop = () => {
    GraphSchematicsManager.loadGraphState({"offsetX":246,"offsetY":20,"width":1724,"height":1000,"scale":1,"vertices":[{"id":3,"x":773,"y":175,"label":"C","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":4,"x":777,"y":501,"label":"D","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":2,"x":416,"y":177,"label":"B","visitCount":0,"sound":{"type":"note","value":"A"},"isFinal":false},{"id":1,"x":414,"y":496,"label":"A","visitCount":19,"sound":{"type":"note","value":"A"},"isFinal":false}],"edges":[{"source":1,"target":2},{"source":2,"target":3},{"source":3,"target":4},{"source":4,"target":1}],"selectedVertex":null,"draggingVertex":false,"edgeCreationMode":false,"edgeStartVertex":null,"edgeWeights":{"1":{"2":[{"read":"0","write":"1","move":"R"}]},"2":{"3":[{"read":"0","write":"1","move":"L"}]},"3":{"4":[{"read":"1","write":"0","move":"R"}]},"4":{"1":[{"read":"1","write":"0","move":"L"}]}},"audioContext":{},"vertexHistory":[],"centroid":{"x":595,"y":337.25},"centroidUpdateCounter":76,"tape":Array(1000).fill("0"),"config":{"speed":1}});
  };

  openExampleBinaryCounter = () => {
    GraphSchematicsManager.loadGraphState({});
  };

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
