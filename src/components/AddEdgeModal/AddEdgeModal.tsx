
import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './AddEdgeModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { FormattedMessage } from 'react-intl';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';

interface Transition {
  input: string;
  output: string;
  direction: 'left' | 'right';
}

interface State {
  showModal: boolean;
  sourceId: number;
  targetId: number;
  transitions: Transition[];
  newTransition: Transition;
}

export default class AddEdgeModal extends React.Component<any, State> {
  static openSubject = new Subject();

  customStyles = {
    content: {
      minHeight: '300px',
      background: 'rgb(42 42 49)',
      border: 'none'
    },
  };

  state: State = {
    showModal: false,
    sourceId: 0,
    targetId: 0,
    transitions: [],
    newTransition: {
      input: '',
      output: '',
      direction: 'right',
    },
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    AddEdgeModal.openSubject.subscribe((obj: any) => {
      this.setState({ showModal: true,
          transitions: [],
          sourceId: obj.sourceId,
          targetId: obj.targetId,
          newTransition: {
            input: '',
            output: '',
            direction: 'right',
        }
      });
    });
  }

  checkDuplicateTransition = (newTransition: Transition): boolean => {
    return this.state.transitions.some(
      transition => 
        transition.input === newTransition.input && 
        transition.output === newTransition.output
    );
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
    GraphSchematicsManager.exitEdgeCreationMode();
  };

  handleAddTransition = () => {
    const { newTransition } = this.state;

    if (this.checkDuplicateTransition(newTransition)) {
      toast.error('Essa transição já existe! (I/O iguais)');
      return;
    }

    this.setState((prevState) => ({
      transitions: [...prevState.transitions, newTransition],
      newTransition: {
        input: '',
        output: '',
        direction: 'left',
      },
    }));
  };

  handleRemoveTransition = (index: number) => {
    this.setState((prevState) => ({
      transitions: prevState.transitions.filter((_, i) => i !== index),
    }));
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newTransition: {
        ...prevState.newTransition,
        [name]: value,
      },
    }));
  };

  handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState((prevState) => ({
      newTransition: {
        ...prevState.newTransition,
        direction: e.target.value as 'left' | 'right',
      },
    }));
  };

  addAndApplyEdgeAndTransitions = () => {
    const { transitions, sourceId, targetId } = this.state;
    GraphSchematicsManager.addAndApplyEdgeAndTransitions({
      transitions,
      sourceId,
      targetId
    });
    this.handleCloseModal();
  }

  render() {
    const { direction, input, output } = this.state.newTransition;

    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Add Transitions"
          style={this.customStyles}
          onRequestClose={this.handleCloseModal}
          overlayClassName="overlay"
          className="content-add-edge"
        >
          <div className="modal-header">
            <div className="modal-title">
              <FormattedMessage id={'add_edge'} />
            </div>
            <div className="modal-close-icon" onClick={this.handleCloseModal}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>

          <div className='modal-content'>
            <div className="transition-form">
              <div>
                <div className="form-group float-left">
                  <label htmlFor="input"><FormattedMessage id={'input'}/>:</label>
                  <input
                    type="text"
                    id="input"
                    name="input"
                    value={input}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group float-left">
                  <label htmlFor="output"><FormattedMessage id={'output'}/>:</label>
                  <input
                    type="text"
                    id="output"
                    name="output"
                    value={output}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group float-left">
                  <label htmlFor="direction"><FormattedMessage id={'direction'}/>:</label>
                  <select
                    id="direction"
                    name="direction"
                    value={direction}
                    onChange={this.handleDirectionChange}
                    className={`direction`}
                    
                  >
                    <option value="left"><FormattedMessage id={'left'}/></option>
                    <option value="right"><FormattedMessage id={'right'}/></option>
                  </select>
                </div>

                <div className='form-group float-left pad-10'>
                  <button className="add-button" onClick={this.handleAddTransition} disabled={!input ||!output}>
                    <FormattedMessage id={'add_transition'} />
                  </button>
                </div>
              </div>
            
            </div>
            <div className="transitions-list">
              
              <FormattedMessage id={'transitions'} />:
              {
              this.state.transitions.length === 0 ? (
                    <div className="alert-add-edge">
                      <FormattedMessage id={'no_transitions_added'} />
                    </div>
                  ) :(
              <ul className='transition-list--ul'>
                {this.state.transitions.map((transition, index) => (
                  <li key={index} className='transition-list--column'>
                    <div className='transition-list--column-label'>
                      {} {transition.input} → {transition.output} , {transition.direction === 'left' ? 'L' : 'R'}
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => this.handleRemoveTransition(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>)
              }
              <button className="save-button" disabled={!this.state.transitions.length} onClick={() => this.addAndApplyEdgeAndTransitions()}>
                <FormattedMessage id={'add_edge'} />
              </button>
            </div>
          </div>
          
        </Modal>
      </div>
    );
  }
}