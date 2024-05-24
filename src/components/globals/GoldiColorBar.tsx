import '../../css/goldi-btn.css';

type GoldiColorBarProps = {
  color: string;
}

export default function GoldiColorBar(props: GoldiColorBarProps) {

  return (
    <div style={{
      backgroundColor: props.color,
      width: '100%',
      height: 5,
    }}>
    </div>
  );
}