import * as anchor from 'anchor-v31';
import vertexProgramJson from '../idls/vertex_program.json';
import { VertexProgram } from '../idls/vertex_program';

export const getProgram = (connection: anchor.web3.Connection) => {
  return new anchor.Program<VertexProgram>(vertexProgramJson, {
    connection,
  });
};
