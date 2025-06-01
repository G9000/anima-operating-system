"""
Graph visualization and debugging utilities for the enhanced chat service.
Provides tools to inspect and visualize the state graph structure.
"""
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

class GraphInspector:
    """Utility for inspecting and visualizing state graphs."""
    
    @staticmethod
    def inspect_graph_structure(graph) -> Dict[str, Any]:
        """Inspect the structure of a compiled graph."""
        inspection = {
            "timestamp": datetime.now().isoformat(),
            "graph_type": type(graph).__name__,
            "has_checkpointer": hasattr(graph, 'checkpointer'),
            "checkpointer_type": type(graph.checkpointer).__name__ if hasattr(graph, 'checkpointer') else None,
            "nodes": [],
            "edges": [],
            "memory_info": {}
        }
        
        # Extract node information
        if hasattr(graph, 'nodes') and graph.nodes:
            inspection["nodes"] = list(graph.nodes.keys())
        
        # Extract edge information  
        if hasattr(graph, 'edges') and graph.edges:
            edges = []
            for edge in graph.edges:
                if hasattr(edge, '__dict__'):
                    edges.append(str(edge))
                else:
                    edges.append(str(edge))
            inspection["edges"] = edges
        
        # Memory information
        if hasattr(graph, 'checkpointer') and graph.checkpointer:
            checkpointer = graph.checkpointer
            if hasattr(checkpointer, 'storage'):
                inspection["memory_info"] = {
                    "storage_type": type(checkpointer.storage).__name__,
                    "stored_threads": len(checkpointer.storage) if checkpointer.storage else 0,
                    "thread_ids": list(checkpointer.storage.keys()) if checkpointer.storage else []
                }
        
        return inspection
    
    @staticmethod
    def create_mermaid_diagram(graph) -> str:
        """Create a Mermaid diagram representation of the graph."""
        nodes = []
        edges = []
        
        if hasattr(graph, 'nodes') and graph.nodes:
            node_list = list(graph.nodes.keys())
            
            # Add START and END nodes
            mermaid = "graph TD\n"
            mermaid += "    START([START])\n"
            
            # Add processing nodes
            for i, node in enumerate(node_list):
                node_display = node.replace("_", " ").title()
                mermaid += f"    {node}[\"{node_display}\"]\n"
            
            mermaid += "    END([END])\n\n"
            
            # Add edges
            mermaid += "    START --> context_preparation\n"
            if "context_preparation" in node_list:
                mermaid += "    context_preparation --> system_prompt_injection\n"
            if "system_prompt_injection" in node_list:
                mermaid += "    system_prompt_injection --> llm_processing\n"
            if "llm_processing" in node_list:
                mermaid += "    llm_processing --> response_formatting\n"
            if "response_formatting" in node_list:
                mermaid += "    response_formatting --> END\n"
            
            # Add styling
            mermaid += "\n    classDef startEnd fill:#e1f5fe\n"
            mermaid += "    classDef processing fill:#f3e5f5\n"
            mermaid += "    class START,END startEnd\n"
            mermaid += f"    class {','.join(node_list)} processing\n"
            
        return mermaid
    
    @staticmethod
    def create_ascii_diagram(graph) -> str:
        """Create a simple ASCII diagram of the graph flow."""
        if not hasattr(graph, 'nodes') or not graph.nodes:
            return "No graph structure available"
        
        nodes = list(graph.nodes.keys())
        
        diagram = """
╔══════════════════════════════════════════════════════════════════╗
║                    Enhanced Chat State Graph                     ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─────────┐    ┌─────────────────────┐    ┌─────────────────┐   ║
║  │  START  │───▶│  Context Preparation │───▶│ System Prompt   │   ║
║  └─────────┘    └─────────────────────┘    │   Injection     │   ║
║                                            └─────────────────┘   ║
║                                                     │            ║
║                                                     ▼            ║
║  ┌─────────┐    ┌─────────────────────┐    ┌─────────────────┐   ║
║  │   END   │◀───│ Response Formatting  │◀───│ LLM Processing  │   ║
║  └─────────┘    └─────────────────────┘    └─────────────────┘   ║
║                                                                  ║
║  Features:                                                       ║
║  • Memory management with thread IDs                            ║
║  • Chat mode support (chat, roleplay, journal, etc.)           ║
║  • Dynamic system prompt generation                             ║
║  • Construct personality integration                            ║
║  • Error handling at each stage                                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
"""
        return diagram
    
    @staticmethod
    def get_memory_stats(graph) -> Dict[str, Any]:
        """Get memory usage statistics."""
        stats = {
            "checkpointer_available": False,
            "total_threads": 0,
            "memory_type": "Unknown",
            "threads": []
        }
        
        if hasattr(graph, 'checkpointer') and graph.checkpointer:
            stats["checkpointer_available"] = True
            stats["memory_type"] = type(graph.checkpointer).__name__
            
            if hasattr(graph.checkpointer, 'storage'):
                storage = graph.checkpointer.storage
                if storage:
                    stats["total_threads"] = len(storage)
                    stats["threads"] = list(storage.keys())
        
        return stats
    
    @staticmethod
    def print_inspection_report(graph):
        """Print a comprehensive inspection report."""
        print("🔍 Graph Inspection Report")
        print("=" * 50)
        
        # Basic structure
        inspection = GraphInspector.inspect_graph_structure(graph)
        print(f"Graph Type: {inspection['graph_type']}")
        print(f"Nodes: {', '.join(inspection['nodes'])}")
        print(f"Has Checkpointer: {inspection['has_checkpointer']}")
        print(f"Checkpointer Type: {inspection['checkpointer_type']}")
        
        # Memory stats
        memory_stats = GraphInspector.get_memory_stats(graph)
        print(f"\n💾 Memory Statistics:")
        print(f"Memory Available: {memory_stats['checkpointer_available']}")
        print(f"Memory Type: {memory_stats['memory_type']}")
        print(f"Active Threads: {memory_stats['total_threads']}")
        if memory_stats['threads']:
            print(f"Thread IDs: {memory_stats['threads'][:5]}...")  # Show first 5
        
        # ASCII diagram
        print(f"\n📊 Graph Structure:")
        print(GraphInspector.create_ascii_diagram(graph))
        
        # Mermaid diagram
        print(f"\n🖼️ Mermaid Diagram (copy to mermaid.live):")
        print("```mermaid")
        print(GraphInspector.create_mermaid_diagram(graph))
        print("```")


def inspect_enhanced_chat_service():
    """Convenience function to inspect the enhanced chat service."""
    try:
        from app.services.enhanced_chat_service import enhanced_chat_service
        
        print("🔬 Enhanced Chat Service Inspection")
        print("=" * 60)
        
        if enhanced_chat_service.is_available():
            GraphInspector.print_inspection_report(enhanced_chat_service.graph)
        else:
            print("❌ Enhanced chat service is not available")
            
    except Exception as e:
        print(f"❌ Error during inspection: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    inspect_enhanced_chat_service()
