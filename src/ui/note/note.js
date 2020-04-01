import React from 'react'
import {Divider, Empty, message} from 'antd'
import SubMenu from './sub-menu/sub-menu'
import Markdown from './markdown/markdown'
import {connect} from 'react-redux'
import File from '../../model/file'
import FileResource from '../../infrastructure/file-resource'
import TitleBar from '../title-bar/title-bar'
import FileCreatorButton from '../title-bar/file-creator-button'
import {UPDATE_CURRENT_EDIT_FILE,} from '../../redux/reducers/dispatch-command/commands'
import MENU from '../note/menu-item'

class Note extends React.Component {
  componentWillReceiveProps = nextProps => {
    if (this.props.selectedDir.path === nextProps.selectedDir.path) {
      return false
    }
    this.props.updateStatus({subMenuVisible: true})
  }

  modifyFileName = (oldPath, newFileName) => {
    if (this._exist(newFileName)) {
      message.warning('file has already exist')
      return false;
    }
    if (this._validate(newFileName)) {
      message.warning('file name could not includes 【\\\\/:*?\"<>|】')
      return false;
    }
    const {selectedDir, currentEditFile} = this.props
    let newPath = FileResource.modifyFileName({oldPath, newFileName})
    if (currentEditFile.path === oldPath) {
      this.props.updateCurrentEditFile(
        FileResource.findFile(newPath)
      )
    }
    this.props.updateSelectedDir(
      selectedDir.path === MENU.SEARCH_RESULT
        ? File.dir(newPath)
        : selectedDir.path)
    this.props.updateDirs(FileResource.initNoteBook(window.getNoteWorkspacePath()))
  }

  modifyFileContent = (path, content) => {
    this.props.updateCurrentEditFile(
      FileResource.modifyFileContent({path, content})
    )
  }

  createFileOrDir = ({path, type}) => {
    let file = FileResource.createFileOrDir({type, path});
    this.props.updateSelectedDir(path)
    if (type === 'dir') {
      this.props.updateDirs(FileResource.initNoteBook(window.getNoteWorkspacePath()))
      return
    }
    this.props.updateCurrentEditFile(file)
  }

  deleteFileOrDir = ({path, type}) => {
    const {selectedDir} = this.props
    FileResource.delete({path, type})
    if (type === 'file') {
      this.props.updateCurrentEditFile({})
    }

    if (type === 'dir') {
      this.props.updateDirs(FileResource.initNoteBook(window.getNoteWorkspacePath()))
    }

    if (selectedDir.path !== MENU.SEARCH_RESULT) {
      this.props.updateSelectedDir(selectedDir.path)
    }

  }

  _exist = fileName => {
    return this.props.selectedDir.sub.filter(file => {
      return File.name(file.path) === fileName
    }).length === 1
  }

  _validate = fileName => {
    const reg = new RegExp('[\\\\/:*?\"<>|]')
    return reg.test(fileName)
  }

  formatMenus = (current) => {
    const workspace = window.getNoteWorkspacePath()
    const {currentEditFile} = this.props
    if (workspace === current.path) {
      return []
    }
    const menus = current.path.substring(workspace.length + 1).split('/');
    if (currentEditFile.path) {
      menus.push(File.name(currentEditFile.path))
    }
    return menus
  }

  updateSelectedDir = _path => {
    this.props.updateCurrentEditFile({})
    this.props.updateSelectedDir(_path)
    this.props.updateStatus({subMenuVisible: true})
  }

  getOperateComponents = () => {
    const {selectedDir} = this.props
    return [
      <FileCreatorButton
        createFileOrDir={this.createFileOrDir}
        selectedDir={selectedDir}
      />, <Divider type='vertical'/>
    ]
  }

  render() {
    const {
      selectedDir, currentEditFile, status
    } = this.props

    return <div>
      <TitleBar
        title='📔NoteBook  '
        menus={this.formatMenus(selectedDir)}
        onClickMenuItem={this.updateSelectedDir}
        operateComponents={this.getOperateComponents()}/>

      <div style={{height: 35}}></div>
      {
        <SubMenu
          modifyFileName={this.modifyFileName}
          deleteFileOrDir={this.deleteFileOrDir}
          currentEditFile={currentEditFile}
          updateCurrentEditFile={this.props.updateCurrentEditFile}
          updateSelectedDir={this.updateSelectedDir}
          selectedDir={selectedDir}
        />
      }
      {
        currentEditFile.path
          ? <Markdown file={currentEditFile}
                      status={status}
                      modifyFileContent={this.modifyFileContent}
                      modifyFileName={this.modifyFileName}
          />
          :
          <Empty
            style={{marginTop: 300}}
            description={false}/>
      }
    </div>;
  }
}

const mapDispatchToProps = dispatch => ({
  updateCurrentEditFile: file => dispatch(UPDATE_CURRENT_EDIT_FILE(file))
})

const mapStateToProps = ({currentEditFile}) => ({
  currentEditFile
})
export default connect(mapStateToProps, mapDispatchToProps)(Note)
