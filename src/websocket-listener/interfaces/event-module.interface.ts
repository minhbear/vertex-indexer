import { Cluster } from 'src/database/entities/rpc.entity';

export interface IndexerCreateEvent {
  programId: string;
  pda: string;
  cluster: Cluster;
}
