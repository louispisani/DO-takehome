export const formatDateInput = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
};

export const formatDateVal = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
}