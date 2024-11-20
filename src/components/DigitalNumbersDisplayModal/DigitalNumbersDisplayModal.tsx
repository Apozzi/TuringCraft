import React from 'react';
import Draggable from 'react-draggable';
import { Subject } from 'rxjs';
import './DigitalNumbersDisplayModal.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import TuringMachineTape from '../TuringMachineTape/TuringMachineTape';
import { FormattedMessage, injectIntl } from 'react-intl';


class DigitalNumbersDisplayModal extends React.Component<any> {
  static openSubject = new Subject();

  state = {
    showModal: false,
    number: '00',
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    DigitalNumbersDisplayModal.openSubject.subscribe((data) => {
      this.setState({ showModal: true, data });
    });
    TuringMachineTape.onTapeChange().subscribe((tape: any) => {
      let indexZero = tape.length/2 - 2
      let decimal = parseInt(tape.slice(indexZero, indexZero + 7).filter((e:any) => !isNaN(e)).join(""), 2);
      this.setState({ number:  decimal < 100 ? String(decimal).padStart(2, '0') : "--"});
    });
  }

  closeModal = () => {
    this.setState({ showModal: false});
  };

  render() {
    const { showModal } = this.state;
    const { intl } = this.props;

    return (
      <div>
        {/* Modal visível apenas quando showModal for true */}
        {showModal && (
          <>
            <Draggable>
              <div className="draggable-modal-container" style={{minHeight: '363px', width: '338px'}}>
                <div className="draggable-modal-header">
                  <div className='draggable-modal-header--title'>
                    <h2><FormattedMessage id={'numeric_display'}/></h2> 
                    <Tippy content={intl.formatMessage({ id: 'display_digitar_number_tip' })}>
                      <div className='draggable-modal-header--tooltip-icon'>?</div>
                    </Tippy>
                  </div>
                  <div className="modal-close-icon" onClick={this.closeModal}>
                    X
                  </div>
                </div>
                <div className="draggable-modal-body">
                  <div className='digital-numbers'>
                      88
                  </div>
                  <div className='digital-numbers'>
                    {this.state.number}
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

export default injectIntl(DigitalNumbersDisplayModal) as unknown as typeof DigitalNumbersDisplayModal;


