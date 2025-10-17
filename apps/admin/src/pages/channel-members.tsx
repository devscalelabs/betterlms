import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@betterlms/ui";
import { useId } from "react";
import { useParams } from "react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useAssignMember } from "../features/channels/hooks/use-assign-member";
import { useChannel } from "../features/channels/hooks/use-channel";
import { useProfiles } from "../features/profiles/hooks/use-profiles";

export const ChannelMembersPage = () => {
	const { id } = useParams();
	const selectId = useId();
	const { channel, isLoadingChannel } = useChannel({ id: id as string });
	const { profiles, isProfilesLoading } = useProfiles();
	const { addMember, removeMember, isAdding, isRemoving } = useAssignMember();

	return (
		<DashboardLayout>
			<Card className="p-6">
				<CardHeader>
					<CardTitle>Manage Members</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoadingChannel || !channel ? (
						<div className="text-sm text-gray-600">Loading...</div>
					) : (
						<div className="space-y-6">
							<div>
								<div className="text-lg font-semibold">
									{channel.name}
									<span className="ml-2 text-sm font-normal text-gray-600">
										{channel.isPrivate ? "Private" : "Public"}
									</span>
								</div>
								<p className="text-sm text-gray-600 mt-1">
									Add or remove members for this channel.
								</p>
							</div>

							{!channel.isPrivate && (
								<div className="p-3 text-sm bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
									Membership can only be managed for private channels.
								</div>
							)}

							{channel.isPrivate && (
								<>
									<div>
										<label
											htmlFor={selectId}
											className="text-sm font-medium text-gray-700"
										>
											Add user
										</label>
										<div className="mt-2 flex items-center gap-2">
											<select
												id={selectId}
												className="border border-gray-200 rounded px-2 py-1 text-sm"
												disabled={isProfilesLoading || isAdding}
												onChange={(e) => {
													const userId = e.target.value;
													if (userId) {
														addMember({ channelId: channel.id, userId });
														e.currentTarget.selectedIndex = 0;
													}
												}}
											>
												<option value="">Select user…</option>
												{profiles.map((u) => (
													<option key={u.id} value={u.id}>
														{u.name} (@{u.username})
													</option>
												))}
											</select>
											<Button variant="outline" size="sm" disabled>
												Add
											</Button>
										</div>
									</div>

									<div>
										<div className="text-sm font-medium text-gray-700">
											Current members
										</div>
										<ul className="mt-2 space-y-2">
											{channel.members.map((m) => (
												<li
													key={m.id}
													className="flex items-center justify-between"
												>
													<span className="text-sm text-gray-800">
														{m.user?.name || m.userId}
														{m.user?.username ? ` (@${m.user.username})` : ""}
													</span>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															removeMember({
																channelId: channel.id,
																userId: m.userId,
															})
														}
														disabled={isRemoving}
													>
														Remove
													</Button>
												</li>
											))}
											{channel.members.length === 0 && (
												<li className="text-sm text-gray-500">No members</li>
											)}
										</ul>
									</div>
								</>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</DashboardLayout>
	);
};
