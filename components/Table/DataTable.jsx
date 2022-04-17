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
import { useSession, getSession } from "next-auth/react";
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

const Footer = ({ total, pages, onChange = () => {} }) => {
  const [activePage, setActivePage] = useState(1);
  const [state, dispatch] = useDataTableContext();
  return (
    <Group position="right" className="mt-4">
      <Text>
        Total : <b> {total}</b> items
      </Text>
      <Pagination
        total={pages}
        page={activePage}
        onChange={(page) => {
          setActivePage(page);
          dispatch({ type: "set", payload: { loading: true } });
          onChange(page, (isLoading) =>
            dispatch({ type: "set", payload: { loading: isLoading } })
          );
        }}
      />
    </Group>
  );
};

DataTable.Footer = Footer;

const Action = ({
  onRefresh = () => {},
  onEdit,
  filterVisibility = true,
  onDelete,
  onSearch = () => {},
}) => {
  const [state, dispatch] = useDataTableContext();
  const router = useRouter();
  const [debounced] = useDebouncedValue(state.search, 500);
  const { data: session, status } = useSession();

  const akses = session.user.role.akses.filter(
    (f) => f.path == router.pathname
  )[0];

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
            disabled={!akses.write}
          >
            Tambah
          </Button>
          {onEdit && (
            <ActionIcon
              size={36}
              color="yellow"
              variant="filled"
              onClick={() => onEdit(state.selection)}
              disabled={false}
            >
              <Pencil />
            </ActionIcon>
          )}
          {onDelete && !akses.write && (
            <ActionIcon
              size={36}
              color="red"
              variant="filled"
              onClick={() => {
                dispatch({ type: "set", payload: { loading: true } });
                onDelete(state.selection, (s) => {
                  dispatch({
                    type: "set",
                    payload: { loading: s, selection: [] },
                  });
                });
              }}
              disabled={state.selection.length == 0}
            >
              <Trash />
            </ActionIcon>
          )}

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
            type="search"
            style={{ flexGrow: 1 }}
            value={state.search}
            onChange={(e) => {
              dispatch({
                type: "set",
                payload: { search: e.target.value, loading: true },
              });
              onSearch(e.target.value, (isLoading) => {
                dispatch({ type: "set", payload: { loading: isLoading } });
              });
            }}
          />
          {filterVisibility && (
            <ActionIcon
              size={36}
              color="blue"
              variant={state.showFilter ? "filled" : "default"}
              onClick={() => dispatch({ type: "toggle_filter" })}
            >
              <FilterIcon />
            </ActionIcon>
          )}
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
