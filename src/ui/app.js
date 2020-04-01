import * as React from 'react'
import {Layout} from 'antd'
import {connect} from 'react-redux'
import FileResource from '../infrastructure/file-resource'
import Note from './note/note'
import LeftMenu from './left-menu/left-menu'

import {
  UPDATE_FILES,
  UPDATE_SELECTED_DIR,
  UPDATE_STATUS
} from '../redux/reducers/dispatch-command/commands'

import '../resources/css/app.css'

const {Sider, Content} = Layout

class App extends React.Component {

  componentDidMount() {
    let workspace = window.getNoteWorkspacePath()
    if (!workspace) {
      workspace = this.initWorkspace()
    }
    this.props.updateDirs(FileResource.initNoteBook(workspace))
  }

  updateSelectedDir = (selectedDir) => {
    this.props.updateSelectedDir(FileResource.findSubFiles(selectedDir))
  }


  initWorkspace = () => {
    const workspace = FileResource.openDir()
    window.localStorage.setItem('workspace', workspace)
    window.localStorage.removeItem('note')
    return workspace
  }
  updateStatus = data => {
    const {status} = this.props
    this.props.updateStatus({...status, ...data})
  }

  render() {
    const {leftMenu, selectedDir, status} = this.props
    return <Layout className='layout'>
      <Sider
        theme='light'
      >
        <LeftMenu
          leftMenu={leftMenu}
          updateMenu={this.updateSelectedDir}
        />
      </Sider>
      <Layout className='layout_right_content_layout'>
        <Content>
          {
            <Note
              status={status}
              leftMenu={leftMenu}
              selectedDir={selectedDir}
              updateStatus={this.updateStatus}
              updateDirs={this.props.updateDirs}
              updateSelectedDir={this.updateSelectedDir}
            />
          }
        </Content>
      </Layout>
    </Layout>
  }
}

const mapDispatchToProps = dispatch => ({
  updateDirs: dirs => dispatch(UPDATE_FILES(dirs)),
  updateSelectedDir: dir => dispatch(UPDATE_SELECTED_DIR(dir)),
  updateStatus: status => dispatch(UPDATE_STATUS(status)),
})

const mapStateToProps = ({
                           leftMenu,
                           selectedDir,
                           status,
                         }) => ({
  leftMenu,
  selectedDir,
  status
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
