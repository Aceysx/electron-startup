import React from 'react'
import {Divider, Empty} from 'antd'
import FileCard from './file-card'
import FileResource from '../../../infrastructure/file-resource'
import File from '../../../model/file'
import '../../../resources/css/sub-menu.css'

const DEFAULT_EDITED_FILE_NAME = {
  old: null,
  now: '',
  type: ''
}

class SubMenu extends React.Component {
  state = {
    selectedDirPath: '',
    editedFileName: DEFAULT_EDITED_FILE_NAME
  }

  closeEditInput = () => {
    this.setState({editedFileName: DEFAULT_EDITED_FILE_NAME})
  }

  openFile = file => {
    this.setState({selectedDirPath: file.path})
    if (file.type === 'dir') {
      this.props.updateSelectedDir(file.path)
      return
    }
    if (file.path === this.props.currentEditFile.path) {
      return
    }
    this.props.updateCurrentEditFile(
      FileResource.findFile(file.path)
    )
  }

  changeFileName = now => {
    const {editedFileName} = this.state
    editedFileName.now = now
    this.setState({editedFileName})
  }

  updateFileName = () => {
    const {editedFileName} = this.state
    const {old, now, type} = editedFileName
    if (File.name(old) !== now) {
      this.props.modifyFileName(old, now, type)
    }
  }

  openEditInput = file => {
    const editedFileName = {
      old: file.path,
      now: File.name(file.path),
      type: file.type
    }
    this.setState({editedFileName})
  }

  subFiles = selectedDir => {
    const {editedFileName, selectedDirPath} = this.state
    return selectedDir.sub.map(file => {
      return <FileCard key={file.path}
                       selectedPath={selectedDirPath}
                       deleteFileOrDir={this.props.deleteFileOrDir}
                       file={file}
                       editedFileName={editedFileName}
                       changeFileName={this.changeFileName}
                       updateFileName={this.updateFileName}
                       openEditInput={this.openEditInput}
                       openFile={this.openFile}
                       closeEditInput={this.closeEditInput}
      />
    })
  }

  render() {
    const {selectedDir} = this.props
    const subFiles = this.subFiles(selectedDir)
    return <div className='layout_right_content_layout_left_menu'>
      <div className='layout_right_content_layout_left_menu_scroll'>
        {
          subFiles.length
            ? subFiles
            : <Empty
              style={{marginTop: '20%', width: '220px'}}
              description={false}
              image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
        <div style={{height: 100}}/>
      </div>
      <div className='layout_right_content_layout_left_menu_bottom'>
        <Divider/>
        {selectedDir.sub.length} items
      </div>
    </div>
  }
}

export default SubMenu