import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  Text,
  ActionIcon,
  Group,
} from "@mantine/core";
import { Pencil, Trash } from "tabler-icons-react";
const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  rows: {
    td: {
      borderLeft: "none",
      borderRight: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const Row = ({ item, parent = "0", children, parentId = 0, level = 0 }) => {
  return (
    <>
      <tr key={item.id}>
        {level > 0 && (
          <td
            style={{
              width: "5rem",
              textAlign: "center",
            }}
          ></td>
        )}
        <td
          style={{
            width: "5rem",
            textAlign: parentId != 0 ? "left" : "center",
            fontWeight: level == 0 ? 700 : 400,
          }}
        >
          {parentId != 0 ? parent + "." + item.kode : item.kode}
        </td>
        <td
          style={{ fontWeight: level == 0 ? 700 : 400 }}
          colSpan={parentId == 0 ? 2 : 1}
        >
          {item.nama}
        </td>
        <td>
          <Text
            sx={(theme) => ({
              color:
                item.tipe == "DEBET"
                  ? theme.colors.green[5]
                  : theme.colors.red[5],
            })}
          >
            {item.tipe}
          </Text>
        </td>
        <td>
          <Group spacing="xs" noWrap className="justify-end">
            <ActionIcon color="yellow" variant="filled" onClick={() => {}}>
              <Pencil size={16} />
            </ActionIcon>
            <ActionIcon color="red" variant="filled">
              <Trash size={16} />
            </ActionIcon>
          </Group>
        </td>
      </tr>
      {item.child &&
        item.child.map((child) => (
          <>
            <Row
              item={child}
              parent={
                child.parentId != 0 ? parent + "." + item.kode : item.kode
              }
              parentId={item.id}
              level={level + 1}
              key={child.id}
            ></Row>
          </>
        ))}
    </>
  );
};

export function AkunTable({ data }) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  return (
    <ScrollArea
      sx={{ height: 500 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table
        sx={{
          borderCollapse: "collapse",
          minWidth: 700,
        }}
      >
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th style={{ width: "5rem" }}>Kode</th>
            <th style={{ width: "5rem" }} colSpan={2}>
              Nama
            </th>
            <th style={{ width: "10rem" }}>Tipe</th>
            <th style={{ textAlign: "right", width: "10rem" }}>Action</th>
          </tr>
        </thead>
        <tbody className={classes.rows}>
          {data.map((item) => (
            <Row item={item} key={item.id}></Row>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
}