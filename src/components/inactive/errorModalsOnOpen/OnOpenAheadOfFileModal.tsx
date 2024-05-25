import { Container, Modal } from 'react-bootstrap';
import ButtonWithTextInsideModal from '../../globals/ButtonWithTextInsideModal';

type OnOpenAheadOfFileModalProps = {
  fileName: string | undefined;
  onOpenAsNew: () => void;
  onCancel: () => void;
  onOverwrite: () => void;
  onContinue: () => void;
}

export default function OnOpenAheadOfFileModal(props: OnOpenAheadOfFileModalProps) {

  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <h6 className='mb-5'>
          You have unsaved changes for this project.
          How would you like to proceed?
        </h6>

        <Container>
          <ButtonWithTextInsideModal
            onClick={props.onContinue}
            buttonText={"Continue"}
            explanation={"This will open the project with your unsaved changes. Please don't forget to save your changes later."}
          />
          <hr/>
          <ButtonWithTextInsideModal
            onClick={props.onOverwrite}
            buttonText={"Overwrite"}
            explanation={"This will reload the data from the file and overwrite the changes in the browser storage."}
          />
          <hr/>
          <ButtonWithTextInsideModal
            onClick={props.onOpenAsNew}
            buttonText={"Parallelize"}
            explanation={"The project will be newly loaded from the file. The other version will be available as an unsaved draft. No data is lost."}
          />
          <hr />
          <ButtonWithTextInsideModal
            onClick={props.onCancel}
            buttonText={"Cancel"}
            explanation={"This will cancel the opening process."}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}