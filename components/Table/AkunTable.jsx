import { useState, useEffect } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  Text,
  ActionIcon,
  Group,
} from "@mantine/core";
import { Pencil, Trash } from "tabler-icons-react";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import ArrayToTree from "array-to-tree";

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

const Tree = ({ data, level = 0, parentKode = "" }) => {
  return (
    <>
      <tr>
        <td
          style={{
            width: "5rem",
            textAlign: "center",
            fontWeight: level == 0 && 500,
          }}
        >
          {level == 0 && parentKode + data.kode}
        </td>
        {level == 0 ? (
          <>
            <td style={{ fontWeight: 500 }} colSpan={2}>
              {data.nama}
            </td>
          </>
        ) : (
          <>
            <td
              style={{
                width: "5rem",
              }}
            >
              {parentKode}
              {data.kode}
            </td>
            <td>{data.nama}</td>
          </>
        )}
        <td style={{ width: "5rem" }}>
          <Text
            sx={(theme) => ({
              color:
                data.tipe == "DEBET"
                  ? theme.colors.green[5]
                  : theme.colors.red[5],
            })}
          >
            {data.tipe}
          </Text>
        </td>
        <td></td>
      </tr>
      {data.children &&
        data.children.map((child) => {
          return (
            <Tree
              data={child}
              key={child.id}
              parentKode={parentKode + data.kode + "."}
              level={level + 1}
            />
          );
        })}
    </>
  );
};

export function AkunTable({ data }) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [newData, setNewData] = useState([]);
  useEffect(() => {
    const tree = ArrayToTree(data, {
      parentProperty: "parentId",
    });
    console.log(tree);
    setNewData(tree);
  }, []);
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
            <th style={{ width: "5rem" }}>Tipe</th>
            <th style={{ textAlign: "right", width: "5rem" }}>Action</th>
          </tr>
        </thead>
        <tbody className={classes.rows}>
          {newData.map((row) => (
            <Tree data={row} key={row.id} />
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
