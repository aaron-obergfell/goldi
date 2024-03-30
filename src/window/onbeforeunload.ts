export const onBeforeUnload = (event: BeforeUnloadEvent) => {
    event.returnValue = `Are you sure you want to leave?`;
};