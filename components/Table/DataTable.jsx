import { useState } from "react";
import {
  Group,
  Collapse,
  Box,
  SimpleGrid,
  Button,
  ActionIcon,
  Pagination,
  Text,
  Select,
  Input,
} from "@mantine/core";
import {
  Plus,
  Pencil,
  Trash,
  Refresh,
  TableExport,
  TableImport,
  Search,
  X,
  Filter as FilterIcon,
} from "tabler-icons-react";

import { useRouter } from "next/router";

import {
  useDataTableContext,
  DataTableProvider,
} from "@components/contexts/DataTableContext";

const DataTable = ({ children }) => {
  return (
    <DataTableProvider>
      <Box
        sx={(theme) => ({
          border: "1px solid",
          borderRadius: theme.radius.sm,
          padding: theme.spacing.sm,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4],
        })}
      >
        {children}
      </Box>
    </DataTableProvider>
  );
};

const Footer = () => {
  return (
    <Group position="right" className="mt-4">
      <Text>showing 1 to 10 from 10</Text>
      <Pagination total={10} />
      <Select
        style={{ maxWidth: "80px" }}
        size="sm"
        data={[
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
        ]}
      />
    </Group>
  );
};

DataTable.Footer = Footer;

const Action = ({
  children,
  controls = {
    create: {
      visible: true,
      disabled: false,
      action: () => {},
    },
    read: {
      visible: true,
      disabled: false,
      action: () => {},
    },
    update: {
      visible: true,
      disabled: false,
      action: () => {},
    },
    delete: {
      visible: true,
      disabled: false,
      action: () => {},
    },
    refresh: { visible: true, disabled: false, action: () => {} },
    export: { visible: true, disabled: false, action: () => {} },
    import: { visible: true, disabled: false, action: () => {} },
    search: {
      visible: true,
      disabled: false,
      action: () => {},
    },
    filter: {
      visible: true,
      disabled: false,
      action: () => {},
    },
  },
}) => {
  const [state, dispatch] = useDataTableContext();
  const router = useRouter();
  return (
    <div className="mb-4">
      <Group
        position="apart"
        sx={(theme) => ({
          [theme.fn.smallerThan("md")]: {
            justifyContent: "flex-start",
          },
        })}
      >
        <Group spacing="xs">
          {controls.create.visible && (
            <Button
              leftIcon={<Plus size={16} />}
              color="green"
              variant="filled"
              onClick={() => router.push(router.asPath + "/tambah")}
              disabled={controls.create.disabled}
            >
              Tambah
            </Button>
          )}
          {controls.update.visible && (
            <ActionIcon
              size={36}
              color="yellow"
              variant="filled"
              onClick={controls.update.action}
              disabled={controls.update.disabled}
            >
              <Pencil />
            </ActionIcon>
          )}
          {controls.delete.visible && (
            <ActionIcon
              size={36}
              color="red"
              variant="filled"
              onClick={controls.delete.action}
              disabled={controls.delete.disabled}
            >
              <Trash />
            </ActionIcon>
          )}
          {controls.refresh.visible && (
            <ActionIcon
              size={36}
              variant="filled"
              onClick={controls.refresh.action}
              disabled={controls.refresh.disabled}
            >
              <Refresh />
            </ActionIcon>
          )}
          {controls.export.visible && (
            <Button
              leftIcon={<TableExport size={16} />}
              variant="default"
              onClick={controls.export.action}
              disabled={controls.export.disabled}
            >
              Export
            </Button>
          )}
          {controls.export.visible && (
            <Button
              leftIcon={<TableImport size={16} />}
              variant="default"
              onClick={controls.import.action}
              disabled={controls.import.disabled}
            >
              Import
            </Button>
          )}
        </Group>
        <Group
          spacing="xs"
          sx={(theme) => ({
            [theme.fn.smallerThan("md")]: {
              width: "100%",
            },
          })}
        >
          <Input
            icon={<Search size={18} />}
            placeholder="Search"
            rightSection={<X size={18} />}
            style={{ flexGrow: 1 }}
          />
          <ActionIcon
            size={36}
            color="blue"
            variant={state.showFilter ? "filled" : "default"}
            onClick={() => dispatch({ type: "toggle_filter" })}
          >
            <FilterIcon />
          </ActionIcon>
        </Group>
      </Group>
    </div>
  );
};

DataTable.Action = Action;

const Filter = ({ children, onFilter }) => {
  const [state, dispatch] = useDataTableContext();

  const cols = () => {
    let length;
    try {
      if (children.length == undefined) {
        length = 1;
      } else {
        length = children.length;
      }
    } catch (error) {
      length = 0;
    }

    if (length >= 3) {
      return 3;
    }
    if (length == 2) {
      return 2;
    }
    if (length == 1) {
      return 1;
    }
  };

  return (
    <Collapse
      in={state.showFilter}
      transitionDuration={200}
      transitionTimingFunction="linear"
    >
      <Box
        className="mb-4"
        sx={(theme) => ({
          border: "1px solid",
          borderRadius: theme.radius.sm,
          padding: theme.spacing.sm,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4],
        })}
      >
        <SimpleGrid
          cols={cols()}
          spacing="md"
          breakpoints={[
            { maxWidth: "md", cols: cols() < 3 ? cols() : 3, spacing: "md" },
            { maxWidth: "sm", cols: cols() < 2 ? cols() : 2, spacing: "sm" },
            { maxWidth: "xs", cols: 1, spacing: "sm" },
          ]}
          className="mb-2"
        >
          {children}
        </SimpleGrid>
        <Group spacing="xs" position="right">
          <Button variant="filled">Filter</Button>
          <Button variant="default">Reset</Button>
        </Group>
      </Box>
    </Collapse>
  );
};
DataTable.Filter = Filter;

export default DataTable;
