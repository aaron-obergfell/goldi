import { Stack, Tab, Tabs } from 'react-bootstrap';
import saveIcon from '../../icons/save.svg'
import saveAsIcon from '../../icons/save_as.svg'
import syncIcon from '../../icons/sync.svg'
import closeIcon from '../../icons/close.svg'
import SmallGoldiButton from '../globals/SmallGoldiButton';
import { GoldiMode } from './ActiveGoldi';

type NavBarProps = {
  saveNeeded: boolean;
  projectId: string;
  onClose: () => void;
  setGoldiMode: (mode: GoldiMode) => void;
  loadFile: (id: string) => Promise<void>;
  save: (id: string) => Promise<void>;

}

export default function NavBarForActiveGoldi(props: NavBarProps) {

  return (
    <>
      <Stack direction="horizontal" gap={2}>
        <SmallGoldiButton
          active={props.saveNeeded}
          onClick={() => props.save(props.projectId)}
          icon={saveIcon}
          tooltipText={'Speichern'}
        />

        <SmallGoldiButton
          active={true}
          onClick={() => alert("Not yet implemented")}
          icon={saveAsIcon}
          tooltipText={'Speichern unter'}
        />

        <SmallGoldiButton
          active={!props.saveNeeded}
          onClick={() => props.loadFile(props.projectId)}
          icon={syncIcon}
          tooltipText={'Neu laden'}
        />

        <div className='ms-auto'>
          <SmallGoldiButton
            active={!props.saveNeeded}
            onClick={props.onClose}
            icon={closeIcon}
            tooltipText={'Dieses Projekt schließen'}
          />
        </div>
      </Stack>

      <Tabs
        onSelect={(eventKey, _e) => {
          switch (eventKey) {
            case "view":
              props.setGoldiMode(GoldiMode.View);
              break;
            case "edit":
              props.setGoldiMode(GoldiMode.Edit);
              break;
          }
        }}
      >
        <Tab eventKey={"view"} title="Hauptansicht" />
        <Tab eventKey={"edit"} title="Bearbeitungsmodus" />
      </Tabs>
    </>
  );
}