import React from 'react';
import cn from 'classnames';


export default class BtnGroup extends React.Component {
  state = { activeBtn: null }

  onLeftBtnClick = () => {
    this.setState({ activeBtn: 'left' });
  }

  onRightBtnClick = () => {
    this.setState({ activeBtn: 'right' });
  }

  render() {
    const leftBtnClass = cn('btn', 'btn-secondary', 'left', {
      active: this.state.activeBtn === 'left',
    });
    const rightBtnClass = cn('btn', 'btn-secondary', 'right', {
      active: this.state.activeBtn === 'right',
    });

    return (
      <div className="btn-group" role="group">
        <button type="button" className={leftBtnClass} onClick={this.onLeftBtnClick}>
          Left
        </button>
        <button type="button" className={rightBtnClass} onClick={this.onRightBtnClick}>
          Right
        </button>
      </div>
    );
  }
}
