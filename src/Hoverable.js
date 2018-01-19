import React from 'react';

class Hoverable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false
    }
  }

  render() {
    const {hovered} = this.state;
    const {component, render, children, hoverStyles, style} = this.props;

    const styles = hoverStyles || {};
    const rootStyle = style || {};

    const ToRender = component || render || children;
    if(!ToRender) return null;
    return (
      <div
        style={rootStyle}
        onMouseEnter={() => this.setState({hovered: true})}
        onMouseLeave={() => this.setState({hovered: false})} >
        <ToRender hovered={hovered} hoverStyles={hovered ? styles : {}} />
      </div>
    )
  }
}

export default Hoverable;