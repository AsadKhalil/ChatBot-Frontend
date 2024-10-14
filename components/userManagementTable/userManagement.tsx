import * as React from "react";
import { useEffect, useState } from "react";
import instance from "@/utils/axiosInstance";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Edit, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InputField from "../common/InputField";
import PrimaryBtn from "../common/PrimaryBtn";
import { format } from "date-fns";
import { Edit3 } from "lucide-react";
import EditUserModal from "../ui/popup";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export type User = {
  name: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string | null;
  last_session_duration?: string | null;
};

const UserManagement = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [userData, setUserData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await instance.post("/get_user_management_data");
      setUserData(transformData(res.data));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className=" text-[#6C737F] uppercase text-[12px] font-medium">
          Name
        </div>
      ),
      cell: ({ row }) => (
        <div className="capitalize text-black-900">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <div className=" text-[#6C737F] uppercase text-[12px] font-medium">
          Email
        </div>
      ),
      cell: ({ row }) => (
        <div className="lowercase text-black-900">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: () => (
        <div className=" text-[#6C737F] uppercase text-[12px] font-medium">
          Role
        </div>
      ),
      cell: ({ row }) => {
        const temp = row.getValue("role");
        return (
          <div className="relative">
            {temp != "Default" && (
              <div className=" text-black-900">{row.getValue("role")}</div>
            )}
            {temp === "Default" && <div className=" text-black-900">AE</div>}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: () => (
        <div className="text-[#6C737F] uppercase text-[12px] font-medium whitespace-nowrap">
          Created At
        </div>
      ),
      cell: ({ row }) => (
        <div className=" text-black-900 whitespace-nowrap">
          {row.getValue("created_at")}
        </div>
      ),
    },
    {
      accessorKey: "last_login",
      header: () => (
        <div className="text-[#6C737F] uppercase text-[12px] font-medium whitespace-nowrap">
          Last Login
        </div>
      ),
      cell: ({ row }) => (
        <div className=" text-black-900 whitespace-nowrap">
          {row.getValue("last_login")}
        </div>
      ),
    },
    {
      accessorKey: "last_session_duration",
      header: () => (
        <div
          title="Last Session Duration"
          className="text-[#6C737F] uppercase text-[12px] font-medium whitespace-nowrap cursor-default">
          LSD (minutes)
        </div>
      ),
      cell: ({ row }) => {
        const duration = row.getValue("last_session_duration");
        const formattedDuration = duration
          ? //@ts-ignore
            parseFloat(duration).toFixed(2)
          : "";
        return <div className=" text-black-900">{formattedDuration}</div>;
      },
    },
    {
      accessorKey: "action",
      header: () => (
        <div className="text-[#6C737F] uppercase text-[12px] font-medium whitespace-nowrap cursor-default">
          Action
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <TooltipProvider>
              <Tooltip delayDuration={23}>
                <TooltipTrigger asChild>
                  <button
                    className=" hover:scale-110 transition-transform"
                    onClick={() => handleEditClick(row.original)}>
                    <Edit size={16} color="#585F6B" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#000] text-white-900">
                  <p>Edit Role </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const transformData = (data: any): User[] => {
    return data.map((item: any) => ({
      name: item[0],
      email: item[1],
      role: item[2],
      created_at: format(new Date(item[3]), "dd-MM-yyyy HH:mm"),
      last_login: item[4]
        ? format(new Date(item[4]), "dd-MM-yyyy HH:mm")
        : null,
      last_session_duration: item[5],
    }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveChanges = (updatedUser: User) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.email === updatedUser.email ? updatedUser : user
      )
    );
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const table = useReactTable({
    data: userData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="border-[#E8ECF0] border rounded-xl bg-white-900 overflow-auto h-full">
      <div className="flex items-center justify-between py-5 px-6 flex-wrap gap-4">
        <p className="font-bold headingText leading-5">User Management</p>
        <div className="max-w-[300px] w-full relative">
          <InputField
            placeholder="Search by Name or Email"
            value={
              ((
                table.getColumn("name") && table.getColumn("email")
              )?.getFilterValue() as string) ?? ""
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = event.target.value;
              const trimmedValue = newValue.trim();

              (
                table.getColumn("name") && table.getColumn("email")
              )?.setFilterValue(trimmedValue);
            }}
            className="max-w-[300px] h-[44px] !mt-0 px-9 "
            type={"text"}
          />
          <Search
            size={16}
            className="absolute top-[50%] -translate-y-[50%] left-3"
          />
        </div>
      </div>
      <div className="overflow-hidden">
        {loading ? (
          <div className="py-4 text-center">Loading...</div>
        ) : (
          <Table className="customTable">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-[#E6EFFF]">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b-[#DDE1E7] hover:bg-[#E7EFFF]">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between space-x-2 p-4 border-t border-[#DDE1E7]">
          <div className="text-sm text-muted-foreground text-gray-500">
            Showing {table.getRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s).
          </div>
          <div className="flex items-center">
            <Button
              className="bg-transparent disabled:bg-transparent border-0 h-[20px]"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ChevronLeft color="#1B232E" />
            </Button>
            <Button
              variant="outline"
              className="bg-transparent disabled:bg-transparent border-0 h-[20px]"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <ChevronRight color="#1B232E" />
            </Button>
          </div>
        </div>
      </div>
      <EditUserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={currentUser}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default UserManagement;
