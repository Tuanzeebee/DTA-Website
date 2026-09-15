import {
  adminCreateMember,
  adminUpdateMember,
  adminDeleteMember,
  type MemberItem,
} from "@/lib/api";
import type { DtaMember } from "@/data";

/**
 * Admin-side member mutations via the real backend API.
 * localStorage overlay has been removed.
 */

/** Map API MemberItem → frontend DtaMember. */
export function memberApiToDto(m: MemberItem): DtaMember {
  return {
    id: m.id,
    name: m.name,
    nameEn: m.nameEn ?? undefined,
    role: m.role,
    type: m.type as DtaMember["type"],
    domain: m.domain,
    ownership:
      m.ownership === "fdi" || m.ownership === "domestic"
        ? m.ownership
        : undefined,
    leader: m.leader ?? undefined,
    phone: m.phone ?? undefined,
    strengths: m.strengths ?? undefined,
    logoUrl: m.logoUrl ?? undefined,
    website: m.website ?? undefined,
  };
}

/** Create a new member via API. Returns the created member. */
export async function saveMember(
  data: Omit<DtaMember, "id">,
): Promise<DtaMember> {
  const created = await adminCreateMember({
    name: data.name,
    nameEn: data.nameEn,
    role: data.role,
    type: data.type,
    domain: data.domain,
    ownership: data.ownership,
    leader: data.leader,
    phone: data.phone,
    strengths: data.strengths,
    logoUrl: data.logoUrl,
    website: data.website,
  });
  return memberApiToDto(created);
}

/** Update an existing member via API. */
export async function updateMember(
  id: string,
  data: Partial<Omit<DtaMember, "id">>,
): Promise<DtaMember> {
  const updated = await adminUpdateMember(id, data);
  return memberApiToDto(updated);
}

/** Delete a member via API. */
export async function deleteMemberApi(id: string): Promise<void> {
  await adminDeleteMember(id);
}
