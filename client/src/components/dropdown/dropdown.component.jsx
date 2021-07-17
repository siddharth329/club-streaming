import React from 'react';
import onClickOutside from 'react-onclickoutside';

class Dropdown extends React.Component {
	// handleClickOutside = (event) => {
	// 	this.props.setDropdownIsOpen(false);
	// };

	render() {
		return <div className={this.props.className}>{this.props.children}</div>;
	}
}
export default onClickOutside(Dropdown);
