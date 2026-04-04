import { downloadFiles } from "./downloadFiles"

const onVaultOpen = async (capsuleId: string) => {
    const blob = await downloadFiles(capsuleId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${capsuleId}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default onVaultOpen;
