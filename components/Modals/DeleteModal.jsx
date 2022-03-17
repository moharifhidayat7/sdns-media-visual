import { Text, Button, Group } from "@mantine/core";
const DeleteModal = ({ context, id, innerProps }) => {
  return (
    <>
      <Text size="sm">{innerProps.modalBody}</Text>
      <Group mt="md" spacing="sm" position="right">
        <Button variant="default" onClick={() => context.closeModal(id)}>
          Close modal
        </Button>
        <Button color="red" onClick={() => context.closeModal(id)}>
          Close modal
        </Button>
      </Group>
    </>
  );
};

export default DeleteModal;
