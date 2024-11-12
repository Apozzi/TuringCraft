
import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './AddEdgeModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';

interface Transition {
  input: string;
  output: string;
  direction: 'left' | 'right';
}

interface State {
  showModal: boolean;
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
    transitions: [],
    newTransition: {
      input: '',
      output: '',
      direction: 'left',
    },
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    AddEdgeModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleAddTransition = () => {
    this.setState((prevState) => ({
      transitions: [...prevState.transitions, prevState.newTransition],
      newTransition: {
        from: '',
        input: '',
        output: '',
        to: '',
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

  render() {
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
                  <label htmlFor="input">Input:</label>
                  <input
                    type="text"
                    id="input"
                    name="input"
                    value={this.state.newTransition.input}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group float-left">
                  <label htmlFor="output">Output:</label>
                  <input
                    type="text"
                    id="output"
                    name="output"
                    value={this.state.newTransition.output}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group float-left">
                  <label htmlFor="direction">Direction:</label>
                  <select
                    id="direction"
                    name="direction"
                    value={this.state.newTransition.direction}
                    onChange={this.handleDirectionChange}
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div className='form-group float-left pad-10'>
                  <button className="add-button" onClick={this.handleAddTransition}>
                    <FormattedMessage id={'add_transition'} />
                  </button>
                </div>
              </div>
            
            </div>
            <div className="transitions-list">
              
              <FormattedMessage id={'transitions'} />:
            
              <ul>
                {this.state.transitions.map((transition, index) => (
                  <li key={index}>
                    {} ({transition.input}/{transition.output}) {} ({transition.direction})
                    <button
                      className="remove-button"
                      onClick={() => this.handleRemoveTransition(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
              <button className="save-button">
                <FormattedMessage id={'add_edge'} />
              </button>
            </div>
          </div>
          
        </Modal>
      </div>
    );
  }
}