import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LibraryBig,
  MinusCircle,
  Search,
  Trash2,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import InputField from "@/components/common/InputField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PdfIcon } from "@/assets/svg";
import { Switch } from "@/components/ui/switch";

export type User = {
  name: string;
  filename: string;
  created_at: string;
  url: string;
  active: boolean;
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
  const [previewUrl, setPreviewUrl] = useState<null | string>(null);
  const [open, setOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [fileToToggle, setFileToToggle] = useState<{
    name: string;
    active: boolean;
  } | null>(null);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/list-files");
      setUserData(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const deleteFile = async (fileName: string) => {
    setIsDeletingFile(true);
    try {
      const response = await instance.post("/delete-file", {
        file_name: fileName,
      });
      if (response.status === 200) {
        toast.success("File deleted successfully");
        fetchUsers();
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("An error occurred while deleting the file");
    } finally {
      setIsDeletingFile(false);
      setIsDeleteModalOpen(false);
      setFileToDelete(null);
    }
  };

  const toggleFileStatus = async (fileName: string, currentStatus: boolean) => {
    setIsTogglingStatus(true);
    try {
      const res = await instance.post("/file-active-toggle", {
        file_name: fileName,
        active: !currentStatus,
      });
      if (res.status === 200) {
        toast.success(
          `File ${currentStatus ? "disabled" : "enabled"} successfully`
        );
        fetchUsers();
        setIsStatusModalOpen(false);
        setFileToToggle(null);
      } else {
        toast.error("Failed to disable file");
      }
    } catch (error) {
      console.log("Error disabling file", error);
      toast.error("An error has occured while disabling the file");
    } finally {
      setIsTogglingStatus(false);
      setIsStatusModalOpen(false);
      setFileToToggle(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "filename",
      header: () => (
        <div className="text-[#6C737F] uppercase text-[12px] font-medium">
          File Name
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={`lowercase flex  justify-between items-center gap-3 ${
            !row.original.active ? "text-gray-400" : ""
          }`}>
          <div className="flex items-center gap-3">
            <PdfIcon />
            <div className="max-w-[300px] truncate">
              {row.getValue("filename")}{" "}
            </div>
          </div>
          <button
            className="text-gray-400 bg rounded-[20px] text-[12px] ml-2"
            onClick={() => {
              setPreviewUrl(row.original.url);
              setOpen(true);
            }}>
            <Eye size={16} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => (
        <div className="text-[#6C737F] uppercase text-[12px] font-medium">
          Added By
        </div>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },

    {
      accessorKey: "created_at",
      header: () => (
        <div className="text-[#6C737F] uppercase text-[12px] font-medium">
          Added At
        </div>
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{row.getValue("created_at")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-[#6C737F] uppercase text-[12px] font-medium">
          Status
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap flex  cursor-pointer">
          <div
            className={`${
              row.original.active === true
                ? "bg-[#D2E3D8] text-[#067647]"
                : "bg-[#D9D9D9] text-black-900"
            }  text-center rounded-[20px] py-[1px] px-4 capitalize text-[12px] max-w-fit`}>
            {row.original.active === true ? "active" : "inactive"}
          </div>
          {row.getValue("status")}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => (
        <div className="text-[#6C737F] uppercase text-[12px] font-medium">
          Action
        </div>
      ),
      cell: ({ row }) => {
        const fileData = row.original;
        return (
          <div className="font-medium flex items-center gap-4 justify-center">
            <span>
              <Switch
                checked={fileData.active}
                className={`${
                  fileData.active === true ? "!bg-[#48b66f]" : "!bg-[#D9D9D9]"
                } `}
                onClick={() => {
                  setFileToToggle({
                    name: fileData.filename,
                    active: fileData.active,
                  });
                  setIsStatusModalOpen(true);
                }}
              />
            </span>
            <Trash2
              size={16}
              className="cursor-pointer text-red-500 hover:text-red-700"
              onClick={() => {
                setFileToDelete(fileData.filename);
                setIsDeleteModalOpen(true);
              }}
            />
          </div>
        );
      },
    },
  ];

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
        <p className="font-bold headingText leading-5">Data Management</p>
        <div className="max-w-[300px] w-full relative">
          <InputField
            placeholder="Search by File Name"
            value={
              (table.getColumn("filename")?.getFilterValue() as string) ?? ""
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = event.target.value;
              const trimmedValue = newValue.trim();

              table.getColumn("filename")?.setFilterValue(trimmedValue);
            }}
            className="max-w-[300px] h-[44px] !mt-0 px-9"
            type={"text"}
          />
          <Search
            size={16}
            className="absolute top-[50%] -translate-y-[50%] left-3"
          />
        </div>
      </div>
      <div>
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
      </div>
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="bg-white-900">
          <DialogHeader>
            <DialogTitle className="mb-4">Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {fileToToggle?.active ? "disable" : "enable"} the file "
              {fileToToggle?.name}"?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              disabled={isTogglingStatus}
              onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary-main text-white-900"
              disabled={isTogglingStatus}
              onClick={() => {
                if (fileToToggle) {
                  toggleFileStatus(fileToToggle.name, fileToToggle.active);
                }
              }}>
              {isTogglingStatus
                ? "Updating..."
                : fileToToggle?.active
                ? "Deactivate"
                : "Activate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white-900">
          <DialogHeader>
            <DialogTitle className="mb-4">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the file "{fileToDelete}"?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-2">
            <Button
              variant="outline"
              disabled={isDeletingFile}
              onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white-900"
              disabled={isDeletingFile}
              onClick={() => {
                if (fileToDelete) {
                  deleteFile(fileToDelete);
                }
              }}>
              {isDeletingFile ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white-900 !max-w-[800px] w-[calc(100%-32px)]">
          <DialogHeader>
            <DialogDescription>
              {previewUrl && (
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    previewUrl
                  )}&embedded=true`}
                  width="100%"
                  height="500px"
                  title="PDF Preview"
                />
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
