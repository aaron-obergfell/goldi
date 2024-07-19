import { useState } from 'react';
import { Project } from '../../../db/appData';
import metaDataIcon from '../../../icons/meta_data.svg'
import addColumnIcon from '../../../icons/add_column.png'
import SmallGoldiButton from '../../globals/SmallGoldiButton'
import EditMetaModal from './EditMetaModal';
import AddColumnModal from './AddColumnModal';
import { Button, Stack } from 'react-bootstrap';
import EditGoldiTable from './EditGoldiTable';
import { createEmptyItem } from '../../../logic/items/itemsService';

type GoldiEditProps = {
  project: Project
}

export default function GoldiEdit(props: GoldiEditProps) {

  const [editMetaData, setEditMetaData] = useState<boolean>(false);
  const [addColumn, setAddColumn] = useState<boolean>(false);

  return (
    <>
      <Stack direction="horizontal" gap={2}>
        <SmallGoldiButton
          active={true}
          onClick={() => setEditMetaData(true)}
          icon={metaDataIcon}
          tooltipText={'edit meta data'}
        />
        <SmallGoldiButton
          active={true}
          onClick={() => setAddColumn(true)}
          icon={addColumnIcon}
          tooltipText={'Add new column'}
        />
        <Button
          active={true}
          onClick={() => createEmptyItem(props.project)}
          title={"New row"}
        >
          New row
        </Button>
      </Stack>
      {editMetaData &&
        <EditMetaModal
          project={props.project}
          onFinish={() => setEditMetaData(false)}
        />
      }
      {addColumn &&
        <AddColumnModal
          project={props.project}
          onFinish={() => setAddColumn(false)}
        />
      }
      <EditGoldiTable project={props.project}></EditGoldiTable>
    </>
  )

}