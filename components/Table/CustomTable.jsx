import { useDataTableContext } from "@components/contexts/DataTableContext";
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Pagination,
  UnstyledButton,
  Center,
  Skeleton,
  Avatar,
  Text,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";

import { useModals } from "@mantine/modals";

import {
  Selector,
  ChevronDown,
  ChevronUp,
  Search,
  Pencil,
  Trash,
  Eye,
} from "tabler-icons-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@components/contexts/GlobalContext";
const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

function Th({ children, reversed, sorted, onSort, ...props }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th} {...props}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart" noWrap>
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  return data;
  // const keys = Object.keys(data[0]);

  // const query = search.toLowerCase().trim();
  // return data.filter((item) =>
  //   keys.some((key) => item[key].toLowerCase().includes(query))
  // );
}

function sortData(data, payload = { sortBy: "", reversed: false, search: "" }) {
  if (!payload.sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[payload.sortBy].localeCompare(a[payload.sortBy]);
      }

      return a[payload.sortBy].localeCompare(b[payload.sortBy]);
    }),
    payload.search
  );
}

const CustomTable = ({
  header,
  children,
  withAction,
  withSelection,
  name = "",
}) => {
  const [state, dispatch] = useDataTableContext();
  const [globalState, globalDispatch] = useGlobalContext();

  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    dispatch({ type: "set", payload: { withAction, withSelection, name } });
  }, []);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    globalDispatch({
      type: "set_data",
      payload: sortData(globalState.data, {
        sortBy: field,
        reversed,
        result: [],
        search: state.search,
      }),
    });
  };

  return (
    <ScrollArea style={{ position: "relative" }}>
      <LoadingOverlay visible={state.loading} radius="sm" />
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            {state.withSelection && (
              <th style={{ width: 40 }}>
                <Checkbox
                  onChange={() => {
                    dispatch({
                      type: "toggle_all",
                      payload: globalState.data.result,
                    });
                  }}
                  checked={state.selection.length === globalState.data.length}
                  indeterminate={
                    state.selection.length > 0 &&
                    state.selection.length !== globalState.data.length
                  }
                  transitionDuration={0}
                />
              </th>
            )}

            {header.map((th) => {
              return (
                <Th
                  key={th.key}
                  sorted={sortBy === th.key}
                  reversed={reverseSortDirection}
                  onSort={() => console.log(th.key)}
                >
                  {th.label}
                </Th>
              );
            })}
            {state.withAction && <th style={{ textAlign: "right" }}>Action</th>}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </ScrollArea>
  );
};

const Row = ({
  children,
  id,
  editLink = "",
  onDelete = () => {},
  deleteField,
  readLink = "",
}) => {
  const [state, dispatch] = useDataTableContext();
  const [globalState, globalDispatch] = useGlobalContext();
  const { classes, cx } = useStyles();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const modals = useModals();

  const openDeleteModal = () => {
    return modals.openConfirmModal({
      title: `Delete ${state.name}`,
      centered: true,
      children: (
        <Text size="sm">
          Anda yakin ingin menghapus
          {deleteField ? <strong> {deleteField}</strong> : ` ${state.name}`}?
          Anda harus menghubungi administrator untuk memulihkan data Anda.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Batalkan" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        setLoading(true);
        onDelete((s) => setLoading(s));
      },
    });
  };

  const selected = state.selection.includes(id);

  return (
    <tr className={cx({ [classes.rowSelected]: selected })}>
      {state.withSelection && (
        <td>
          <Checkbox
            checked={state.selection.includes(id)}
            onChange={() => dispatch({ type: "toogle_row", payload: id })}
            transitionDuration={0}
          />
        </td>
      )}
      {children}
      {state.withAction && (
        <td>
          <Group spacing="xs" noWrap className="justify-end">
            {readLink && (
              <ActionIcon
                color="blue"
                variant="filled"
                onClick={() =>
                  router.push(router.asPath.split("?")[0] + readLink)
                }
              >
                <Eye size={16} />
              </ActionIcon>
            )}

            <ActionIcon
              color="yellow"
              variant="filled"
              onClick={() =>
                router.push(router.asPath.split("?")[0] + editLink)
              }
              disabled={loading}
            >
              <Pencil size={16} />
            </ActionIcon>
            <ActionIcon
              color="red"
              variant="filled"
              onClick={openDeleteModal}
              loading={loading}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        </td>
      )}
    </tr>
  );
};

CustomTable.Row = Row;

const Col = ({ children }) => {
  return <td>{children}</td>;
};

CustomTable.Col = Col;

export { CustomTable };
