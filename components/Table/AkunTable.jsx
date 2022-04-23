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

export function AkunTable({ data }) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row) => (
    <tr key={row.id}>
      <td
        style={{
          width: "5rem",
          fontWeight: row.parentId ? 400 : 700,
          textAlign: "center",
        }}
      >
        {row.parentId ? "" : row.kode}
      </td>
      <td
        style={{
          width: "5rem",
          fontWeight: row.parentId ? 400 : 700,
          textAlign: row.parentId ? "center" : "left",
        }}
        colSpan={row.parentId ? 1 : 2}
      >
        {row.parentId ? `${row.parentId}.${row.kode}` : row.nama}
      </td>
      {row.parentId && <td>{row.nama}</td>}
      <td>
        <Text
          sx={(theme) => ({
            color:
              row.tipe == "DEBET" ? theme.colors.green[5] : theme.colors.red[5],
          })}
        >
          {row.tipe}
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
  ));

  return (
    <ScrollArea
      sx={{ height: 300 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table
        sx={{
          minWidth: 700,
          borderCollapse: "collapse",
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
        <tbody className={classes.rows}>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
