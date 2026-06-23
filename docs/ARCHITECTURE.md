# OMEGA-CORE Architecture Deep Dive

## Overview
This document details the internal mechanics of the DARLEK CANN v3.0 system, specifically the integration of the Z AGI framework.

## Z AGI Integration
The Z AGI framework provides the boundary conditions for the `sovereign-kernel`. 

1. **Constraint Definition**: All self-refactoring code must pass a validation check against the `ZConstraint` interface.
2. **Memory Persistence**: State is serialized using atomic operations to prevent corruption during refactoring cycles.
3. **Swarm Dynamics**: Agents operate as independent nodes in an N-Body simulation, where 'mass' is defined by computational complexity.