export interface CodeFile {
  path: string;
  name: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'json';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: CodeFile[] = [
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts',
    language: 'groovy',
    description: 'Configuración de Gradle con dependencias de Jetpack Compose, Room Database, Material Design 3 y Navigation',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.ksp)
}

android {
    namespace = "com.panelapro.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.panelapro.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    
    // Navigation Compose
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // Room Database (SQLite)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // ViewModel & Lifecycle
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
}`
  },
  {
    path: 'app/src/main/java/com/panelapro/app/data/db/PanelaEntities.kt',
    name: 'PanelaEntities.kt',
    language: 'kotlin',
    description: 'Entidades Room (Tablas SQLite) para Usuario, LoteProduccion, Inventario, Cliente, Venta y DetalleVenta',
    content: `package com.panelapro.app.data.db

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ForeignKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val username: String,
    val fullName: String,
    val trapicheName: String,
    val email: String,
    val role: String,
    val rememberSession: Boolean = true
)

@Entity(tableName = "production_batches")
data class ProductionBatchEntity(
    @PrimaryKey val id: String,
    val code: String,
    val date: String,
    val caneAmountKg: Double,
    val panelaProducedKg: Double,
    val panelaType: String,
    val status: String, // Molienda, Clarificación, Punteo, Moldeo, Empacado, Finalizado
    val observations: String,
    val operatorName: String,
    val rendimientoPercentage: Double,
    val createdAt: String
)

@Entity(tableName = "inventory_items")
data class InventoryEntity(
    @PrimaryKey val id: String,
    val code: String,
    val name: String,
    val category: String, // MateriaPrima o ProductoTerminado
    val quantity: Double,
    val unit: String,
    val minStock: Double,
    val costPerUnit: Double,
    val sellPricePerUnit: Double,
    val location: String,
    val lastUpdated: String
)

@Entity(tableName = "clients")
data class ClientEntity(
    @PrimaryKey val id: String,
    val name: String,
    val documentType: String, // NIT o CC
    val documentNumber: String,
    val phone: String,
    val email: String,
    val address: String,
    val municipality: String,
    val notes: String? = null
)

@Entity(tableName = "sales")
data class SaleEntity(
    @PrimaryKey val id: String,
    val invoiceCode: String,
    val clientId: String,
    val clientName: String,
    val date: String,
    val total: Double,
    val paymentMethod: String,
    val status: String,
    val notes: String? = null
)

@Entity(
    tableName = "sale_details",
    foreignKeys = [
        ForeignKey(
            entity = SaleEntity::class,
            parentColumns = ["id"],
            childColumns = ["saleId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class SaleDetailEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val saleId: String,
    val inventoryItemId: String,
    val productName: String,
    val quantity: Double,
    val unitPrice: Double,
    val subtotal: Double
)`
  },
  {
    path: 'app/src/main/java/com/panelapro/app/data/db/PanelaDaos.kt',
    name: 'PanelaDaos.kt',
    language: 'kotlin',
    description: 'Interfaces DAO de Room con consultas SQL (Flow y Coroutines) para CRUD completo',
    content: `package com.panelapro.app.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface ProductionBatchDao {
    @Query("SELECT * FROM production_batches ORDER BY date DESC")
    fun getAllBatches(): Flow<List<ProductionBatchEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBatch(batch: ProductionBatchEntity)

    @Update
    suspend fun updateBatch(batch: ProductionBatchEntity)

    @Delete
    suspend fun deleteBatch(batch: ProductionBatchEntity)
}

@Dao
interface InventoryDao {
    @Query("SELECT * FROM inventory_items ORDER BY name ASC")
    fun getAllInventory(): Flow<List<InventoryEntity>>

    @Query("SELECT * FROM inventory_items WHERE quantity <= minStock")
    fun getLowStockAlerts(): Flow<List<InventoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertItem(item: InventoryEntity)

    @Update
    suspend fun updateItem(item: InventoryEntity)

    @Delete
    suspend fun deleteItem(item: InventoryEntity)
}

@Dao
interface ClientDao {
    @Query("SELECT * FROM clients ORDER BY name ASC")
    fun getAllClients(): Flow<List<ClientEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertClient(client: ClientEntity)

    @Update
    suspend fun updateClient(client: ClientEntity)

    @Delete
    suspend fun deleteClient(client: ClientEntity)
}

@Dao
interface SaleDao {
    @Query("SELECT * FROM sales ORDER BY date DESC")
    fun getAllSales(): Flow<List<SaleEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSale(sale: SaleEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSaleDetails(details: List<SaleDetailEntity>)
}`
  },
  {
    path: 'app/src/main/java/com/panelapro/app/data/repository/PanelaRepository.kt',
    name: 'PanelaRepository.kt',
    language: 'kotlin',
    description: 'Repositorio Central MVVM para gestión limpia de datos, Room Database y lógica comercial',
    content: `package com.panelapro.app.data.repository

import com.panelapro.app.data.db.*
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class PanelaRepository @Inject constructor(
    private val batchDao: ProductionBatchDao,
    private val inventoryDao: InventoryDao,
    private val clientDao: ClientDao,
    private val saleDao: SaleDao
) {
    // Producción
    val allBatches: Flow<List<ProductionBatchEntity>> = batchDao.getAllBatches()
    
    suspend fun saveBatch(batch: ProductionBatchEntity) {
        batchDao.insertBatch(batch)
    }

    suspend fun deleteBatch(batch: ProductionBatchEntity) {
        batchDao.deleteBatch(batch)
    }

    // Inventario
    val allInventory: Flow<List<InventoryEntity>> = inventoryDao.getAllInventory()
    val lowStockItems: Flow<List<InventoryEntity>> = inventoryDao.getLowStockAlerts()

    suspend fun saveInventoryItem(item: InventoryEntity) {
        inventoryDao.insertItem(item)
    }

    suspend fun deleteInventoryItem(item: InventoryEntity) {
        inventoryDao.deleteItem(item)
    }

    // Clientes
    val allClients: Flow<List<ClientEntity>> = clientDao.getAllClients()

    suspend fun saveClient(client: ClientEntity) {
        clientDao.insertClient(client)
    }

    suspend fun deleteClient(client: ClientEntity) {
        clientDao.deleteClient(client)
    }

    // Ventas y Deducción de Stock
    val allSales: Flow<List<SaleEntity>> = saleDao.getAllSales()

    suspend fun registerSale(
        sale: SaleEntity, 
        details: List<SaleDetailEntity>,
        inventoryUpdates: List<InventoryEntity>
    ) {
        saleDao.insertSale(sale)
        saleDao.insertSaleDetails(details)
        // Actualiza automáticamente el stock en inventario
        inventoryUpdates.forEach { updatedItem ->
            inventoryDao.updateItem(updatedItem)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/panelapro/app/ui/theme/Color.kt',
    name: 'Color.kt',
    language: 'kotlin',
    description: 'Paleta de colores inspirada en la panela y el cultivo de caña de azúcar (Material Design 3)',
    content: `package com.panelapro.app.ui.theme

import androidx.compose.ui.graphics.Color

// Paleta Inspirada en la Industria Panelera
val PanelaGreenPrimary = Color(0xFF2E7D32)      // Verde Caña Fresca
val PanelaGreenDark = Color(0xFF1B5E20)         // Verde Follaje Profundo
val PanelaGreenLight = Color(0xFFA5D6A7)        // Verde Brote

val PanelaBrownSecondary = Color(0xFF6D4C41)    // Color Miel / Panela
val PanelaBrownLight = Color(0xFFD7CCC8)        // Bagazo claro
val PanelaAmberAccent = Color(0xFFFFB300)       // Pailas Calientes / Melaza

val PanelaBackground = Color(0xFFFAF8F5)        // Beige Orgánico Neutra
val PanelaSurface = Color(0xFFFFFFFF)           // Blanco Tarjeta
val PanelaOnPrimary = Color(0xFFFFFFFF)`
  },
  {
    path: 'app/src/main/java/com/panelapro/app/ui/screens/ProductionScreen.kt',
    name: 'ProductionScreen.kt',
    language: 'kotlin',
    description: 'Interfaz Jetpack Compose M3 para registro y control de lotes de producción con calculador de rendimiento %',
    content: `package com.panelapro.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PrecisionManufacturing
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.panelapro.app.data.db.ProductionBatchEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductionScreen(
    batches: List<ProductionBatchEntity>,
    onAddBatch: () -> Unit,
    onDeleteBatch: (ProductionBatchEntity) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Lotes de Producción - PanelaPró") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAddBatch,
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Nuevo Lote")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(batches) { batch ->
                BatchCard(batch = batch, onDelete = { onDeleteBatch(batch) })
            }
        }
    }
}

@Composable
fun BatchCard(batch: ProductionBatchEntity, onDelete: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = batch.code,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary
                )
                AssistChip(
                    onClick = { },
                    label = { Text(batch.status) }
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text("Caña procesada: \${batch.caneAmountKg} kg")
            Text("Panela producida: \${batch.panelaProducedKg} kg (\${batch.panelaType})")
            Text("Rendimiento: \${"%.2f".format(batch.rendimientoPercentage)}%")
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                IconButton(onClick = onDelete) {
                    Icon(
                        Icons.Default.Delete, 
                        contentDescription = "Eliminar", 
                        tint = MaterialTheme.colorScheme.error
                    )
                }
            }
        }
    }
}`
  }
];
