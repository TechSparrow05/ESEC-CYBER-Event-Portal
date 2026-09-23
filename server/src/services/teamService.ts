import crypto from 'crypto';

export interface TeamRecord {
  id: string;
  teamCode: string;
  teamName: string;
  eventId: string;
  leaderId: string;
  members: string[];
  maxSize: number;
}

export class TeamService {
  // In-memory team storage for dev preview
  private teams = new Map<string, TeamRecord>();
  private codeIndex = new Map<string, string>(); // code -> teamId

  /**
   * Generate an uppercase 6-character alphanumeric team code
   */
  generateTeamCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // omit ambiguous chars I, O, 0, 1
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(crypto.randomInt(0, chars.length));
    }
    return code;
  }

  createTeam(teamName: string, eventId: string, leaderId: string, maxSize = 4): TeamRecord {
    let teamCode = this.generateTeamCode();
    while (this.codeIndex.has(teamCode)) {
      teamCode = this.generateTeamCode();
    }

    const team: TeamRecord = {
      id: `team_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      teamCode,
      teamName,
      eventId,
      leaderId,
      members: [leaderId],
      maxSize
    };

    this.teams.set(team.id, team);
    this.codeIndex.set(teamCode, team.id);
    return team;
  }

  joinTeam(teamCode: string, userId: string): TeamRecord {
    const cleanCode = teamCode.trim().toUpperCase();
    const teamId = this.codeIndex.get(cleanCode);
    if (!teamId) {
      throw new Error('Invalid Team Code: No active team found with code ' + cleanCode);
    }

    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    if (team.members.includes(userId)) {
      return team; // already in team
    }

    if (team.members.length >= team.maxSize) {
      throw new Error(`Team is full! Maximum allowed members is ${team.maxSize}.`);
    }

    team.members.push(userId);
    return team;
  }

  getTeamByCode(teamCode: string): TeamRecord | undefined {
    const teamId = this.codeIndex.get(teamCode.trim().toUpperCase());
    return teamId ? this.teams.get(teamId) : undefined;
  }
}

export const teamService = new TeamService();
