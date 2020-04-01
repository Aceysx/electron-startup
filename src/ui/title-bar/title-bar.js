import React from 'react'
import HeaderMenu from './header-menu'
import {Divider} from 'antd'
import '../../resources/css/title-bar.css'

class TitleBar extends React.Component {
  render() {
    const {menus = [], title, operateComponents = []} = this.props
    return <div className='title-bar-box'>
      <Divider type='vertical'/>
      <HeaderMenu
        operateComponents={operateComponents}
        title={title}
        menus={menus}
        onClickMenuItem={this.props.onClickMenuItem}
      />
    </div>
  }
}

export default TitleBar