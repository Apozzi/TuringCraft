import React from 'react';
import Draggable from 'react-draggable';
import { Subject } from 'rxjs';
import './ScreenDisplayModal.css';
import Tippy from '@tippyjs/react';
import TuringMachineTape from '../TuringMachineTape/TuringMachineTape';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import { FormattedMessage, injectIntl } from 'react-intl';

class ScreenDisplayModal extends React.Component<any> {
  static openSubject = new Subject();

  state = {
    showModal: false,
    pixels: Array.from({ length: 340 }),
    offset : 0,
    tape: []
  };

  static openModal(obj: any) {
    this.openSubject.next(obj); 
  }

  componentDidMount() {
    ScreenDisplayModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
    TuringMachineTape.onTapeChange().subscribe((tape: any) => {
      const { offset } = this.state;
      this.setState({ tape, pixels: this.getPixelsFromTape(tape, offset)});
    });
    GraphSchematicsManager.onChangeConfig().subscribe(config => {
      const { tape } = this.state;
      this.setState({offset: config.offsetScreenDisplay, pixels: this.getPixelsFromTape(tape, config.offsetScreenDisplay)})
    })
  }

  getPixelsFromTape(tape:any, offset: number) {
    let indexZero = tape.length/2 - 2
    return tape.slice(indexZero + offset, indexZero + 340 + offset)
  }

  closeModal = () => {
    this.setState({ showModal: false });
  };

  private getColor = (value: any) => {
    if (value === 1) return 'white';
    if (value === 2) return 'red';
    if (value === 3) return 'green';
    if (value === 4) return 'blue';
    if (String(value).includes("#")) return value;
    return '#ffffff00';
  }

  renderPixels = () => {
    const pixels = this.state.pixels.map((v, index) => (
      <div key={index} className="pixel" style={{backgroundColor: this.getColor(v)}}></div>
    ));

    const rows = [];
    for (let i = 0; i < pixels.length; i += 20) {
      rows.push(
        <div key={`row-${i}`} className="pixel-row">
          {pixels.slice(i , i + 20)}
        </div>
      );
    }

    return rows;
  };
  render() {
    const { showModal, offset } = this.state;
    const { intl } = this.props;

    return (
      <div>
        {showModal && (
          <>
            <Draggable>
              <div className="draggable-modal-container">
                <div className="draggable-modal-header">
                <div className='draggable-modal-header--title'>
                    <h2><FormattedMessage id={'screen_display'}/></h2> 
                    <Tippy content={intl.formatMessage({ id: 'display_msg_tip_1' })  + (0 + offset) + "-" + (340 + offset) + intl.formatMessage({ id: 'display_msg_tip_2' })}>
                      <div className='draggable-modal-header--tooltip-icon'>?</div>
                    </Tippy>
                  </div>
                  <div className="modal-close-icon" onClick={this.closeModal}>
                    X
                  </div>
                </div>
                <div className="draggable-modal-body">
                  <div className="screen-background">
                    {this.renderPixels()}
                  </div>
                </div>
              </div>
            </Draggable>
          </>
        )}
      </div>
    );
  }
}

export default injectIntl(ScreenDisplayModal) as unknown as typeof ScreenDisplayModal;
