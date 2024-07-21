import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../../css/goldi-btn.css';

type MediumGoldiButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: string;
  tooltipText: string;
}

export default function MediumGoldiButton(props: MediumGoldiButtonProps) {

  const tooltip: JSX.Element = (
    <Tooltip id="tooltip">
      {props.tooltipText}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="bottom" overlay={tooltip}>
      <img
        src={props.icon}
        alt="?"
        onClick={props.onClick}
        className={props.active ? "active" : "inactive"}
        width={"30px"}
      />
    </OverlayTrigger>
  );
}