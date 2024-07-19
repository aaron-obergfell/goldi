import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../../css/goldi-btn.css';

type SmallGoldiButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: string;
  tooltipText: string;
  visibleOnHover?: boolean;
}

export default function SmallGoldiButton(props: SmallGoldiButtonProps) {

  const tooltip: JSX.Element = (
    <Tooltip id="tooltip">
      {props.tooltipText}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="bottom" overlay={tooltip}>
      <div className={props.visibleOnHover ? "visible-on-hover" : ""}>
        <img
          src={props.icon}
          alt="?"
          onClick={props.onClick}
          className={props.active ? "active" : "inactive"}
          width={"20px"}
        />
      </div>
    </OverlayTrigger>
  );
}