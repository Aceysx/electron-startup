import * as React from 'react'
import {Card, Icon, Input, Popconfirm} from 'antd'
import File from '../../../model/file'

import '../../../resources/css/file-card.css'

const FileCard = ({
                    file, openFile, deleteFileOrDir, selectedPath, editedFileName, changeFileName,
                    updateFileName, openEditInput, closeEditInput
                  }) => {

  const getParentDir = file => {
    return {
      path: File.dir(file.path),
      type: 'dir'
    }
  }

  return <Card className={`file-card-box ${selectedPath === file.path ? 'file-card-box-selected' : ''}`}>
    {
      editedFileName.old === file.path
        ? <p><Input size="small"
                    autoFocus
                    value={editedFileName.now}
                    onChange={e => changeFileName(e.target.value)}
                    onPressEnter={updateFileName}
                    suffix={
                      <Icon onClick={closeEditInput}
                            type="close"
                            style={{color: 'rgba(0,0,0,.45)'}}/>
                    }/>
        </p>
        : <p className='file-card-li-title cursor_pointer'
             onClick={() => openFile(file)}>
          {
            file.type === 'dir'
              ? <Icon type="folder" className='file-card-dir-icon'/>
              : <Icon type="file-markdown" className='file-card-file-icon'/>
          }
          {File.name(file.path)}
        </p>
    }
    <p className='file-card-extra'>
      <Icon type="folder-open"
            className='cursor_pointer'
            style={{fontSize: 14, color: '#b7906b'}}
            onClick={() => openFile(getParentDir(file))}
      />
      <label> {file.ctime.split('T')[0]}</label>

      <Popconfirm title="确认删除？"
                  okText="是"
                  onConfirm={() => deleteFileOrDir(file)}
                  cancelText="否">
        <span className='file-card-extra-delete-icon'>
          <Icon className='cursor_pointer' type="delete"/>
        </span>
      </Popconfirm>
      <span className='file-card-extra-edit-icon '
            onClick={() => openEditInput(file)}>
        <Icon  type="edit"/>
      </span>
    </p>
  </Card>
}

export default FileCard