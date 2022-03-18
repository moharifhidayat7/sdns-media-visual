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
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useCallback, useState } from "react";
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
  onRefresh = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onSearch = () => {},
}) => {
  const [state, dispatch] = useDataTableContext();
  const router = useRouter();
  const [debounced] = useDebouncedValue(state.search, 500);

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
          <Button
            leftIcon={<Plus size={16} />}
            color="green"
            variant="filled"
            onClick={() => {
              router.push(router.asPath + "/form");
            }}
            disabled={false}
          >
            Tambah
          </Button>
          <ActionIcon
            size={36}
            color="yellow"
            variant="filled"
            onClick={() => onEdit(state.selection)}
            disabled={false}
          >
            <Pencil />
          </ActionIcon>
          <ActionIcon
            size={36}
            color="red"
            variant="filled"
            onClick={() => {
              dispatch({ type: "set", payload: { loading: true } });
              onDelete(state.selection, (s) => {
                dispatch({
                  type: "set",
                  payload: { loading: s },
                });
              });
            }}
            disabled={state.selection.length == 0}
          >
            <Trash />
          </ActionIcon>
          <ActionIcon
            size={36}
            variant="filled"
            onClick={() => {
              dispatch({ type: "set", payload: { loading: true } });
              onRefresh((isLoading) =>
                dispatch({ type: "set", payload: { loading: isLoading } })
              );
            }}
          >
            <Refresh />
          </ActionIcon>
          <Button
            leftIcon={<TableExport size={16} />}
            variant="default"
            onClick={() => {}}
            disabled={false}
          >
            Export
          </Button>
          <Button
            leftIcon={<TableImport size={16} />}
            variant="default"
            onClick={() => {}}
            disabled={false}
          >
            Import
          </Button>
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
            value={state.search}
            onChange={(e) =>
              dispatch({ type: "set", payload: { search: e.target.value } })
            }
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

const Filter = ({ children, form, onFilter = () => {} }) => {
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
        <form onSubmit={form.onSubmit(onFilter)}>
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
            <Button variant="filled" type="submit">
              Filter
            </Button>
            <Button variant="default" onClick={() => form.reset()}>
              Reset
            </Button>
          </Group>
        </form>
      </Box>
    </Collapse>
  );
};
DataTable.Filter = Filter;

export default DataTable;
