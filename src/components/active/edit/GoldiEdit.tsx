import { useState } from 'react';
import { Project } from '../../../db/appData';
import metaDataIcon from '../../../icons/meta_data.svg'
import SmallGoldiButton from '../../globals/SmallGoldiButton'
import EditMetaModal from './EditMetaModal';

type GoldiEditProps = {
  project: Project
}

export default function GoldiEdit(props: GoldiEditProps) {

  const [editMetaData, setEditMetaData] = useState<boolean>(false);

  return (
    <>
      <SmallGoldiButton
        active={true}
        onClick={() => setEditMetaData(true)}
        icon={metaDataIcon}
        tooltipText={'edit meta data'}
      />
      <EditMetaModal
        show={editMetaData}
        project={props.project}
        onFinish={() => setEditMetaData(false)}
      />
    </>
  )

}