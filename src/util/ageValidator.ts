export function isUnder18(birthDate: string): boolean {
    if (!birthDate) return false;

    const parts = birthDate.split('/');
    if (parts.length !== 3) return false;

    const birth = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0])
    );

    if (isNaN(birth.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age < 18;
}