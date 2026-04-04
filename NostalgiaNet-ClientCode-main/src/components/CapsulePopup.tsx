interface VaultProp {
  id: string;
  createdAt: number;
  size: number;
  name: string;
  openAt: number;
}

const CapsulePopup = ({capsule, onCloseModal}:{ capsule: VaultProp, onCloseModal: () => void}) => {
  return <div className=""></div>;
};

export default CapsulePopup;
