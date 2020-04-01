import React from 'react'
import {Tree} from 'antd'
import File from '../../model/file'
import SideBarHeader from "./sidebar-header";

const {TreeNode, DirectoryTree} = Tree

export default class LeftMenu extends React.Component {
  onSelect = keys => {
    this.props.updateMenu(keys[0])
  }

  listTree = dirs => {
    return dirs.filter(item => item.type === 'dir')
      .map(dir => {
        const subDirs = dir.sub.filter(item => item.type === 'dir')
        return <TreeNode
          title={<span className='cursor_pointer'>{File.name(dir.path)}</span>}
          key={dir.path}>
          {this.listTree(subDirs)}
        </TreeNode>
      })
  }

  render() {
    const {leftMenu} = this.props

    return <div>
      <div style={{height: 100}}>
        <SideBarHeader/>
      </div>
      {
        leftMenu.path
          ?
          <div>
            <DirectoryTree
              defaultExpandedKeys={[leftMenu.path]}
              onSelect={this.onSelect}>
              {this.listTree(leftMenu.sub)}
            </DirectoryTree>
          </div>
          : ''
      }
    </div>
  }
}