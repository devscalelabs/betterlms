import { getUserInitials } from "@betterlms/common/strings";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card,
	Checkbox,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Input,
} from "@betterlms/ui";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { useProfiles } from "../features/profiles/hooks/use-profiles";
import { useSuspendUser } from "../features/profiles/hooks/use-suspend-user";
import { useUnsuspendUser } from "../features/profiles/hooks/use-unsuspend-user";
import type { Profile } from "../features/profiles/types";

type StatusFilter = "all" | "active" | "suspended";

export const UsersPage = () => {
	const { profiles, isProfilesLoading } = useProfiles();
	const { suspendUser, isSuspending } = useSuspendUser();
	const { unsuspendUser, isUnsuspending } = useUnsuspendUser();
	const [rowSelection, setRowSelection] = useState({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	const columns = useMemo<ColumnDef<Profile>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				),
				enableSorting: false,
				enableHiding: false,
			},
			{
				accessorKey: "name",
				header: ({ column }) => {
					return (
						<button
							type="button"
							className="flex items-center gap-2 hover:text-gray-700"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
						>
							Name
							{column.getIsSorted() === "asc" ? (
								<ArrowUp className="h-4 w-4" />
							) : column.getIsSorted() === "desc" ? (
								<ArrowDown className="h-4 w-4" />
							) : (
								<ArrowUpDown className="h-4 w-4 opacity-50" />
							)}
						</button>
					);
				},
				cell: ({ row }) => (
					<div className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarImage
								src={row.original.imageUrl}
								alt={row.original.name}
							/>
							<AvatarFallback>
								{getUserInitials(row.original.name)}
							</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium text-gray-900">
							{row.original.name}
						</span>
					</div>
				),
			},
			{
				accessorKey: "username",
				header: ({ column }) => {
					return (
						<button
							type="button"
							className="flex items-center gap-2 hover:text-gray-700"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
						>
							Username
							{column.getIsSorted() === "asc" ? (
								<ArrowUp className="h-4 w-4" />
							) : column.getIsSorted() === "desc" ? (
								<ArrowDown className="h-4 w-4" />
							) : (
								<ArrowUpDown className="h-4 w-4 opacity-50" />
							)}
						</button>
					);
				},
				cell: ({ row }) => (
					<span className="text-sm text-gray-600">
						@{row.original.username}
					</span>
				),
			},
			{
				accessorKey: "email",
				header: ({ column }) => {
					return (
						<button
							type="button"
							className="flex items-center gap-2 hover:text-gray-700"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
						>
							Email
							{column.getIsSorted() === "asc" ? (
								<ArrowUp className="h-4 w-4" />
							) : column.getIsSorted() === "desc" ? (
								<ArrowDown className="h-4 w-4" />
							) : (
								<ArrowUpDown className="h-4 w-4 opacity-50" />
							)}
						</button>
					);
				},
				cell: ({ row }) => (
					<span className="text-sm text-gray-600">{row.original.email}</span>
				),
			},
			{
				accessorKey: "role",
				header: ({ column }) => {
					return (
						<button
							type="button"
							className="flex items-center gap-2 hover:text-gray-700"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
						>
							Role
							{column.getIsSorted() === "asc" ? (
								<ArrowUp className="h-4 w-4" />
							) : column.getIsSorted() === "desc" ? (
								<ArrowDown className="h-4 w-4" />
							) : (
								<ArrowUpDown className="h-4 w-4 opacity-50" />
							)}
						</button>
					);
				},
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
							{row.original.role}
						</span>
						{row.original.isSuspended && (
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
								Suspended
							</span>
						)}
					</div>
				),
				filterFn: (row, id, value) => {
					return value.includes(row.getValue(id));
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right">Actions</div>,
				cell: ({ row }) => (
					<div className="text-right space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								if (row.original.isSuspended) {
									unsuspendUser(row.original.username);
								} else {
									suspendUser(row.original.username);
								}
							}}
							disabled={isSuspending || isUnsuspending}
						>
							{row.original.isSuspended ? "Unsuspend" : "Suspend"}
						</Button>
						<Button variant="outline" size="sm">
							Delete
						</Button>
					</div>
				),
			},
		],
		[suspendUser, unsuspendUser, isSuspending, isUnsuspending],
	);

	const filteredProfiles = useMemo(() => {
		return profiles.filter((profile) => {
			if (statusFilter === "active") {
				return !profile.isSuspended;
			}
			if (statusFilter === "suspended") {
				return profile.isSuspended;
			}
			return true; // "all"
		});
	}, [profiles, statusFilter]);

	const table = useReactTable({
		data: filteredProfiles,
		columns,
		state: {
			rowSelection,
			globalFilter,
			sorting,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const selectedRows = table.getFilteredSelectedRowModel().rows;

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex items-center">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Users</h2>
						<p className="text-sm text-gray-600 mt-1">
							Manage all users in the platform ({profiles.length} total)
						</p>
					</div>
				</div>

				<Card className="p-6">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Input
								placeholder="Search users..."
								className="max-w-sm"
								value={globalFilter}
								onChange={(e) => setGlobalFilter(e.target.value)}
							/>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="gap-2">
										{statusFilter === "all"
											? "All Users"
											: statusFilter === "active"
												? "Active Users"
												: "Suspended Users"}
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem
										onClick={() => setStatusFilter("all")}
										className={statusFilter === "all" ? "bg-gray-100" : ""}
									>
										All Users
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setStatusFilter("active")}
										className={statusFilter === "active" ? "bg-gray-100" : ""}
									>
										Active Users
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setStatusFilter("suspended")}
										className={
											statusFilter === "suspended" ? "bg-gray-100" : ""
										}
									>
										Suspended Users
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						{selectedRows.length > 0 && (
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600">
									{selectedRows.length} user(s) selected
								</span>
								<Button variant="outline" size="sm">
									Bulk Suspend
								</Button>
								<Button variant="outline" size="sm">
									Bulk Delete
								</Button>
							</div>
						)}
					</div>

					{isProfilesLoading ? (
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
								<p className="text-sm text-gray-600 mt-4">Loading users...</p>
							</div>
						</div>
					) : table.getRowModel().rows.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-sm text-gray-600">
								{globalFilter
									? "No users found matching your search"
									: "No users yet"}
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									{table.getHeaderGroups().map((headerGroup) => (
										<tr
											key={headerGroup.id}
											className="border-b border-gray-200"
										>
											{headerGroup.headers.map((header) => (
												<th
													key={header.id}
													className="text-left py-3 px-4 text-sm font-semibold text-gray-900"
												>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody>
									{table.getRowModel().rows.map((row) => (
										<tr key={row.id} className="border-b border-gray-100">
											{row.getVisibleCells().map((cell) => (
												<td key={cell.id} className="py-3 px-4">
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Card>
			</div>
		</DashboardLayout>
	);
};
